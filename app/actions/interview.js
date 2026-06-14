"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { getUserRole } from "@/lib/roles";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

const pipelineStages = ["applied", "screening", "interview", "offer", "hired", "rejected"];

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith("sk-")) return null;
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function sanitizeText(value, maxLength) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}

function sanitizeLongText(value, maxLength) {
    return String(value || "")
        .replace(/\r\n/g, "\n")
        .replace(/\n{4,}/g, "\n\n\n")
        .trim()
        .slice(0, maxLength);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clampScore(value) {
    const score = Number(value || 0);
    if (Number.isNaN(score)) return 0;
    return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreWithoutAI(transcript, resumeText = "") {
    const wordCount = `${resumeText} ${transcript}`.split(/\s+/).filter(Boolean).length;
    const base = Math.min(90, Math.max(45, Math.round(wordCount / 4)));

    return {
        communication_score: Math.min(95, base + 5),
        technical_score: base,
        confidence_score: Math.min(92, base + 3),
        cultural_fit_score: Math.min(90, base),
        resume_score: Math.min(94, base + (resumeText ? 4 : 0)),
        skill_match_score: Math.min(94, base + 2),
        overall_score: Math.min(94, Math.round((base + base + 5 + base + 3 + base) / 4)),
        hiring_recommendation: base > 72 ? "Strong follow-up" : base > 55 ? "Review manually" : "Needs more evidence",
        ai_summary: "Fallback scoring was used because OpenAI is not configured. Review the transcript and resume manually before making a hiring decision.",
        strengths: ["Structured response", "Relevant experience signal"],
        concerns: base < 60 ? ["Needs deeper human review"] : [],
    };
}

async function analyzeInterview({ job, transcript, resumeText }) {
    const openai = getOpenAIClient();
    if (!openai) return scoreWithoutAI(transcript, resumeText);

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: "You evaluate first-round job applications. Return JSON only with integer scores from 0-100 for communication_score, technical_score, confidence_score, cultural_fit_score, resume_score, skill_match_score, overall_score, plus hiring_recommendation, ai_summary, strengths array, and concerns array.",
                },
                {
                    role: "user",
                    content: `Job title: ${job.title}
Skills: ${(job.required_skills || []).join(", ")}
Interview type: ${job.interview_type}

Resume / candidate background:
${resumeText || "No resume text supplied."}

Transcript:
${transcript}`,
                },
            ],
        });

        const parsed = JSON.parse(completion.choices[0].message.content);
        return {
            communication_score: clampScore(parsed.communication_score),
            technical_score: clampScore(parsed.technical_score),
            confidence_score: clampScore(parsed.confidence_score),
            cultural_fit_score: clampScore(parsed.cultural_fit_score),
            resume_score: clampScore(parsed.resume_score),
            skill_match_score: clampScore(parsed.skill_match_score),
            overall_score: clampScore(parsed.overall_score),
            hiring_recommendation: sanitizeText(parsed.hiring_recommendation || "Review manually", 160),
            ai_summary: sanitizeLongText(parsed.ai_summary || "No summary returned.", 1200),
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map((item) => sanitizeText(item, 160)).slice(0, 6) : [],
            concerns: Array.isArray(parsed.concerns) ? parsed.concerns.map((item) => sanitizeText(item, 160)).slice(0, 6) : [],
        };
    } catch (error) {
        console.error("Interview analysis failed:", error);
        return scoreWithoutAI(transcript, resumeText);
    }
}

async function getAllowedJobIdsForUser(supabase, userId, role) {
    if (role === "admin") return null;

    const { data: user } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", userId)
        .single();

    if (!user?.organization_id) return [];

    const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id")
        .eq("organization_id", user.organization_id);

    if (jobsError || !jobs?.length) return [];
    return jobs.map((job) => job.id);
}

async function requireRecruiterAccess() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const role = await getUserRole();
    if (role !== "recruiter" && role !== "admin") {
        throw new Error("Forbidden: Recruiter access is required.");
    }

    return { userId, role };
}

/**
 * Generates an Interview Token & Initiates Vapi call.
 * This is a foundational abstraction representing where the Vapi connection operates.
 */
export async function generateInterviewSession(jobId, candidateData) {
    const supabase = createSupabaseServerClient();
    const { data: interview, error } = await supabase
        .from("interviews")
        .insert([
            {
                job_id: jobId,
                candidate_name: candidateData.name,
                candidate_email: candidateData.email,
                candidate_phone: candidateData.phone || null,
                application_stage: "screening",
                status: "pending",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Failed to initialize interview", error);
        throw new Error("Unable to create interview record.");
    }

    const vapiToken = process.env.VAPI_PRIVATE_API_KEY;
    const assistantId = process.env.VAPI_ASSISTANT_ID;

    return {
        success: true,
        interviewId: interview.id,
        vapiConfig: {
            assistantId: assistantId || "placeholder_assistant_id",
            token: vapiToken ? "valid" : "missing",
        },
    };
}

export async function submitCandidateInterview(formData) {
    const token = sanitizeText(formData.get("token"), 32);
    const candidateName = sanitizeText(formData.get("candidate_name"), 120);
    const candidateEmail = sanitizeText(formData.get("candidate_email"), 180).toLowerCase();
    const candidatePhone = sanitizeText(formData.get("candidate_phone"), 40);
    const resumeText = sanitizeLongText(formData.get("resume_text"), 12000);
    const rawAnswers = formData.get("answers");

    if (!token || !candidateName || !candidateEmail || !rawAnswers) {
        throw new Error("Missing candidate details or interview answers.");
    }

    if (!isValidEmail(candidateEmail)) {
        throw new Error("Enter a valid candidate email.");
    }

    const supabase = createSupabaseServerClient();
    const { data: job, error: jobError } = await supabase
        .from("jobs")
        .select("id, title, required_skills, interview_type")
        .eq("interview_token", token)
        .single();

    if (jobError || !job) {
        throw new Error("This interview link is invalid or expired.");
    }

    let answers = [];
    try {
        answers = JSON.parse(rawAnswers);
    } catch {
        throw new Error("Interview answers were not saved correctly. Please try again.");
    }

    if (!Array.isArray(answers) || answers.length === 0) {
        throw new Error("Please answer at least one interview question.");
    }

    const safeAnswers = answers
        .map((item) => ({
            question: sanitizeLongText(item?.question, 500),
            answer: sanitizeLongText(item?.answer, 3000),
        }))
        .filter((item) => item.question && item.answer)
        .slice(0, 12);

    if (!safeAnswers.length) {
        throw new Error("Please answer at least one interview question.");
    }

    const transcript = safeAnswers
        .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
        .join("\n\n");

    const analysis = await analyzeInterview({ job, transcript, resumeText });

    const { data: existingSubmission } = await supabase
        .from("interviews")
        .select("id")
        .eq("job_id", job.id)
        .eq("candidate_email", candidateEmail)
        .maybeSingle();

    if (existingSubmission) {
        throw new Error("An interview has already been submitted with this email for this job.");
    }

    const { data: interview, error } = await supabase
        .from("interviews")
        .insert([
            {
                job_id: job.id,
                candidate_name: candidateName,
                candidate_email: candidateEmail,
                candidate_phone: candidatePhone || null,
                candidate_resume_text: resumeText || null,
                transcript,
                ...analysis,
                tags: [
                    analysis.overall_score >= 80 ? "high-signal" : "needs-review",
                    analysis.skill_match_score >= 75 ? "skill-match" : "manual-review",
                ],
                application_stage: "screening",
                source: "interview_link",
                status: "completed",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Interview submission failed:", error);
        throw new Error("Unable to submit interview.");
    }

    revalidatePath("/dashboard/candidates");
    revalidatePath("/dashboard/pipeline");
    revalidatePath(`/dashboard/jobs/${job.id}`);

    return { success: true, interviewId: interview.id };
}

export async function fetchInterviews() {
    const { userId, role } = await requireRecruiterAccess();
    const supabase = createSupabaseServerClient();
    const allowedJobIds = await getAllowedJobIdsForUser(supabase, userId, role);
    if (Array.isArray(allowedJobIds) && allowedJobIds.length === 0) return [];

    let query = supabase
        .from("interviews")
        .select("*, jobs(title, organization_id, organizations(name))")
        .order("created_at", { ascending: false });

    if (Array.isArray(allowedJobIds)) {
        query = query.in("job_id", allowedJobIds);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Fetch interviews error:", error);
        return [];
    }

    return data || [];
}

export async function fetchInterviewById(id) {
    const { userId, role } = await requireRecruiterAccess();
    const supabase = createSupabaseServerClient();
    const allowedJobIds = await getAllowedJobIdsForUser(supabase, userId, role);
    if (Array.isArray(allowedJobIds) && allowedJobIds.length === 0) return null;

    let query = supabase
        .from("interviews")
        .select("*, jobs(title, description, required_skills, interview_type, organization_id, organizations(name))")
        .eq("id", id);

    if (Array.isArray(allowedJobIds)) {
        query = query.in("job_id", allowedJobIds);
    }

    const { data, error } = await query.single();
    if (error) return null;
    return data;
}

export async function updateCandidateStage(formData) {
    const { userId, role } = await requireRecruiterAccess();

    const id = formData.get("interview_id");
    const stage = formData.get("application_stage");
    if (!id || !pipelineStages.includes(stage)) throw new Error("Invalid candidate stage.");

    const supabase = createSupabaseServerClient();
    const allowedJobIds = await getAllowedJobIdsForUser(supabase, userId, role);

    let query = supabase
        .from("interviews")
        .update({ application_stage: stage, last_activity_at: new Date().toISOString() })
        .eq("id", id);

    if (Array.isArray(allowedJobIds)) {
        query = query.in("job_id", allowedJobIds);
    }

    const { error } = await query.select("id").single();
    if (error) throw new Error("Unable to update candidate stage.");

    revalidatePath("/dashboard/candidates");
    revalidatePath("/dashboard/pipeline");
    revalidatePath(`/dashboard/candidates/${id}`);
    return { success: true };
}

export async function saveCandidateNotes(formData) {
    const { userId, role } = await requireRecruiterAccess();

    const id = formData.get("interview_id");
    const recruiter_notes = sanitizeLongText(formData.get("recruiter_notes"), 4000);
    const next_step = sanitizeText(formData.get("next_step"), 240);
    if (!id) throw new Error("Missing candidate id.");

    const supabase = createSupabaseServerClient();
    const allowedJobIds = await getAllowedJobIdsForUser(supabase, userId, role);

    let query = supabase
        .from("interviews")
        .update({ recruiter_notes, next_step, last_activity_at: new Date().toISOString() })
        .eq("id", id);

    if (Array.isArray(allowedJobIds)) {
        query = query.in("job_id", allowedJobIds);
    }

    const { error } = await query.select("id").single();
    if (error) throw new Error("Unable to save notes.");

    revalidatePath("/dashboard/candidates");
    revalidatePath(`/dashboard/candidates/${id}`);
    return { success: true };
}

export async function fetchPipelineData() {
    const interviews = await fetchInterviews();
    return pipelineStages.map((stage) => ({
        stage,
        candidates: interviews.filter((item) => (item.application_stage || "screening") === stage),
    }));
}

export async function generateRecruiterEmailDraft(id, type = "next-round") {
    const interview = await fetchInterviewById(id);
    if (!interview) return "";

    const greeting = `Hi ${interview.candidate_name},`;
    if (type === "reject") {
        return `${greeting}\n\nThank you for taking the time to complete the interview for ${interview.jobs?.title}. After reviewing your responses, we will not be moving forward for this role at this time.\n\nWe appreciate your interest and wish you the best in your search.\n\nBest,\nHiring Team`;
    }

    return `${greeting}\n\nThank you for completing the interview for ${interview.jobs?.title}. We were impressed by ${interview.strengths?.[0] || "your experience and communication"} and would like to invite you to the next step.\n\nPlease share a few times that work for you this week.\n\nBest,\nHiring Team`;
}

export async function fetchRecruiterAnalytics() {
    const interviews = await fetchInterviews();
    const completed = interviews.filter((item) => item.status === "completed");
    const scores = completed.map((item) => item.overall_score || 0).filter(Boolean);
    const averageScore = scores.length
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0;

    const recommendationCounts = completed.reduce((acc, item) => {
        const key = item.hiring_recommendation || "Review manually";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const stageCounts = interviews.reduce((acc, item) => {
        const key = item.application_stage || "screening";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return {
        totalInterviews: interviews.length,
        completedInterviews: completed.length,
        pendingInterviews: interviews.length - completed.length,
        averageScore,
        recommendationCounts,
        stageCounts,
        topCandidates: completed
            .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
            .slice(0, 5),
    };
}

/**
 * Placeholder Webhook for Vapi Completion.
 * Called by Vapi when the call ends to sync transcripts and OpenAI analysis.
 */
export async function handleVapiCompletionWebhook(payload) {
    const { interviewId, transcript, recordingUrl, analysis } = payload;

    const supabase = createSupabaseServerClient();

    await supabase
        .from("interviews")
        .update({
            transcript,
            recording_url: recordingUrl || null,
            communication_score: analysis?.communicationScore || 0,
            technical_score: analysis?.technicalScore || 0,
            confidence_score: analysis?.confidenceScore || 0,
            overall_score: analysis?.overallScore || 0,
            ai_summary: analysis?.summary || "No summary provided.",
            status: "completed",
        })
        .eq("id", interviewId);

    return { success: true };
}
