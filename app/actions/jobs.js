"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { getUserRole } from "@/lib/roles";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import OpenAI from "openai";

function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith("sk-")) {
        return null;
    }

    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

function normalizeQuestions(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (Array.isArray(value?.questions)) return value.questions.filter(Boolean);
    return [];
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

function allowedValue(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
}

function buildFallbackQuestions({ title, experience_level, interview_type, required_skills }) {
    const skillText = required_skills.length ? required_skills.join(", ") : "the core skills for this role";

    return [
        `Walk us through your most relevant experience for a ${title} role.`,
        `Which project best demonstrates your strength with ${skillText}?`,
        `Describe a technical decision you made recently and the tradeoffs you considered.`,
        `How do you approach debugging when the issue is unclear or spans multiple systems?`,
        `Tell us about a time you had to communicate a complex idea to a non-technical teammate.`,
        `What would you prioritize in your first 30 days in this ${experience_level} role?`,
        interview_type === "behavioral"
            ? "Describe a conflict or disagreement at work and how you handled it."
            : "How would you validate that your solution is reliable, maintainable, and ready for users?",
        "What questions would you ask the hiring team before accepting this role?",
    ];
}

export async function createJob(formData) {
    // Security Checks
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized: Please sign in to create a job.");
    }

    const role = await getUserRole();
    if (role !== "recruiter" && role !== "admin") {
        throw new Error("Forbidden: You do not have permission to create jobs.");
    }

    const supabase = createSupabaseServerClient();

    // Get the user's organization from Supabase directly to be doubly sure
    const { data: userOrg } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", userId)
        .single();

    const organization_id = userOrg?.organization_id;
    if (!organization_id) throw new Error("You must create an organization first.");

    // Form Parsing
    const title = sanitizeText(formData.get("title"), 120);
    const description = sanitizeLongText(formData.get("description"), 8000);
    const experience_level = allowedValue(formData.get("experience_level"), ["junior", "mid", "senior", "lead"], "mid");
    const interview_type = allowedValue(formData.get("interview_type"), ["technical", "behavioral", "mixed"], "technical");
    const generateAiQuestions = formData.get("generate_questions") === "true";

    const requiredSkillsString = sanitizeText(formData.get("required_skills"), 1000);
    const required_skills = requiredSkillsString
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20);

    if (!title || !description) {
        throw new Error("Missing title or description.");
    }

    if (title.length < 3 || description.length < 40) {
        throw new Error("Add a clearer job title and at least a short role description.");
    }

    let ai_questions = [];

    // Optional: Generate AI Questions
    if (generateAiQuestions) {
        try {
            const openai = getOpenAIClient();
            if (!openai) {
                ai_questions = buildFallbackQuestions({ title, experience_level, interview_type, required_skills });
            } else {
                const prompt = `
            You are an expert technical recruiter forming an interview script.
            Job Title: ${title}
            Experience Level: ${experience_level}
            Interview Type: ${interview_type}
            Skills Required: ${required_skills.join(", ")}
            Job Description: ${description}

            Generate exactly 8 highly relevant interview questions tailored to the above criteria. 
            If the type is technical, focus on system design and coding concepts. If HR/behavioral, focus on soft skills. If mixed, do half and half.
            Return a JSON object with a single key "questions" containing an array of strings.
            `;

                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: prompt }],
                    model: "gpt-4o-mini",
                    response_format: { type: "json_object" },
                });

                const parsed = JSON.parse(completion.choices[0].message.content);
                ai_questions = normalizeQuestions(parsed)
                    .map((question) => sanitizeText(question, 300))
                    .slice(0, 8);
            }

        } catch (error) {
            console.error("AI Generation Error", error);
            ai_questions = buildFallbackQuestions({ title, experience_level, interview_type, required_skills });
        }
    }

    if (generateAiQuestions && ai_questions.length < 4) {
        ai_questions = buildFallbackQuestions({ title, experience_level, interview_type, required_skills });
    }

    const interview_token = nanoid(12);

    // DB Insert
    const { data, error } = await supabase
        .from("jobs")
        .insert([
            {
                organization_id,
                recruiter_id: userId,
                title,
                description,
                required_skills,
                experience_level,
                interview_type,
                ai_questions,
                interview_token,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Job Creation Error", error);
        throw new Error("Database error while creating job.");
    }

    revalidatePath("/dashboard/recruiter");
    revalidatePath("/dashboard/jobs");
    revalidatePath("/dashboard/pipeline");

    return { success: true, job: data };
}

export async function fetchJobs() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const role = await getUserRole();
    const supabase = createSupabaseServerClient();

    let query = supabase
        .from("jobs")
        .select("*, organizations(name), interviews(id, status, overall_score)")
        .order("created_at", { ascending: false });

    // Admins see all. Recruiter sees only their org's jobs.
    if (role !== "admin") {
        const { data: user } = await supabase.from("users").select("organization_id").eq("id", userId).single();
        if (user?.organization_id) {
            query = query.eq('organization_id', user.organization_id);
        } else {
            return []; // No org = no jobs
        }
    }

    const { data, error } = await query;
    if (error) {
        console.error("Fetch Jobs Error:", error);
        return [];
    }
    return data;
}

export async function fetchJobById(id) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const role = await getUserRole();
    const supabase = createSupabaseServerClient();
    let query = supabase
        .from("jobs")
        .select("*, organizations(name), interviews(*)")
        .eq("id", id);

    if (role !== "admin") {
        const { data: user } = await supabase
            .from("users")
            .select("organization_id")
            .eq("id", userId)
            .single();

        if (!user?.organization_id) return null;
        query = query.eq("organization_id", user.organization_id);
    }

    const { data, error } = await query.single();

    if (error) return null;
    return data;
}

export async function fetchJobByToken(token) {
    if (!token) return null;

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("id, title, description, required_skills, experience_level, interview_type, ai_questions, interview_token, organizations(name)")
        .eq("interview_token", token)
        .single();

    if (error) return null;
    return data;
}
