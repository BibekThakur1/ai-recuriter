"use server";

import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Generates an Interview Token & Initiates Vapi call.
 * This is a foundational abstraction representing where the Vapi connection operates.
 */
export async function generateInterviewSession(jobId, candidateData) {
    // 1. Create a pending interview record in Supabase
    const supabase = createSupabaseServerClient();
    const { data: interview, error } = await supabase
        .from("interviews")
        .insert([
            {
                job_id: jobId,
                candidate_name: candidateData.name,
                candidate_email: candidateData.email,
                status: "pending",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Failed to initialize interview", error);
        throw new Error("Unable to create interview record.");
    }

    // 2. Placeholder: Initialize Vapi Web Call
    // Real implementation involves generating a temporary Vapi auth token
    // and associating it with the `interview.id` for webhook callbacks.
    const vapiToken = process.env.VAPI_PRIVATE_API_KEY;
    const assistantId = process.env.VAPI_ASSISTANT_ID;

    // Returning a conceptual interface
    return {
        success: true,
        interviewId: interview.id,
        vapiConfig: {
            assistantId: assistantId || "placeholder_assistant_id",
            token: vapiToken ? "valid" : "missing",
        },
    };
}

/**
 * Placeholder Webhook for Vapi Completion.
 * Called by Vapi when the call ends to sync transcripts and OpenAI analysis.
 */
export async function handleVapiCompletionWebhook(payload) {
    const { interviewId, transcript, recordingUrl, analysis } = payload;

    const supabase = createSupabaseServerClient();

    // Assuming `analysis` is parsed by OpenAI on Vapi's end or locally 
    // via a parallel OpenAI tool call
    await supabase
        .from("interviews")
        .update({
            transcript: transcript,
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
