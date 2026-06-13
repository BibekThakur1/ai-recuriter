import { fetchJobByToken } from "@/app/actions/jobs";
import { notFound } from "next/navigation";
import InterviewClient from "./InterviewClient";

export default async function InterviewPage({ params }) {
    const job = await fetchJobByToken(params.token);

    if (!job) {
        notFound();
    }

    return <InterviewClient job={job} token={params.token} />;
}
