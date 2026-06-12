"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { checkRole } from "@/lib/roles";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function createJob(formData) {
    // Security Checks
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        throw new Error("Unauthorized: Please sign in to create a job.");
    }

    const role = sessionClaims?.metadata?.role || "candidate";
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
    const title = formData.get("title");
    const description = formData.get("description");
    const experience_level = formData.get("experience_level") || "mid";
    const interview_type = formData.get("interview_type") || "technical";
    const generateAiQuestions = formData.get("generate_questions") === "true";

    const requiredSkillsString = formData.get("required_skills") || "";
    const required_skills = requiredSkillsString
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    if (!title || !description) {
        throw new Error("Missing title or description.");
    }

    let ai_questions = [];

    // Optional: Generate AI Questions
    if (generateAiQuestions) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OpenAI API key is missing. Cannot generate questions.");
        }

        try {
            const prompt = `
            You are an expert technical recruiter forming an interview script.
            Job Title: ${title}
            Experience Level: ${experience_level}
            Interview Type: ${interview_type}
            Skills Required: ${required_skills.join(", ")}
            Job Description: ${description}

            Generate exactly 8 highly relevant interview questions tailored to the above criteria. 
            If the type is technical, focus on system design and coding concepts. If HR/behavioral, focus on soft skills. If mixed, do half and half.
            Return ONLY a valid JSON array of strings. No markdown formatting, no explanations.
            `;

            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: "gpt-4-turbo-preview", // or gpt-3.5-turbo if cost is an issue
                response_format: { type: "json_object" }, // ensure json
            });

            // Re-prompt specifically for json object if using json_object mode
            const promptJson = `
            You are an expert technical recruiter forming an interview script.
            Job Title: ${title}
            Experience Level: ${experience_level}
            Interview Type: ${interview_type}
            Skills: ${required_skills.join(", ")}
            
            Generate exactly 8 relevant questions. Return a JSON object with a single key "questions" containing an array of strings.
            `;

            const completionJson = await openai.chat.completions.create({
                messages: [{ role: "system", content: promptJson }],
                model: "gpt-4-turbo-preview",
                response_format: { type: "json_object" },
            });

            const parsed = JSON.parse(completionJson.choices[0].message.content);
            ai_questions = parsed.questions || [];

        } catch (error) {
            console.error("AI Generation Error", error);
            throw new Error("Failed to generate AI questions. Check your OpenAI API Key.");
        }
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
                interview_token
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

    return { success: true, job: data };
}

export async function fetchJobs() {
    const { userId, sessionClaims } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const role = sessionClaims?.metadata?.role;
    const supabase = createSupabaseServerClient();

    let query = supabase.from("jobs").select("*").order("created_at", { ascending: false });

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

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("*, organizations(name)")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}
