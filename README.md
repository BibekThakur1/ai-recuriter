# AI Recruiter

AI Recruiter is a full-stack hiring platform prototype built with Next.js, Clerk, Supabase, OpenAI, and Tailwind CSS. Recruiters can create organizations, post jobs, generate AI interview questions, share candidate interview links, and review AI-scored submissions.

## Features

- Clerk authentication with candidate, recruiter, and admin roles
- Recruiter organization onboarding
- Job creation with optional OpenAI-generated interview questions
- Unique public interview links per job
- Candidate interview submission flow
- AI-assisted transcript scoring with fallback scoring when OpenAI is not configured
- Recruiter dashboard with live metrics, top candidates, jobs, candidates, analytics, and settings pages
- Supabase schema with organizations, users, jobs, and interviews

## Tech Stack

- Next.js 14 App Router
- React 18
- Clerk for authentication and role metadata
- Supabase Postgres for data storage
- OpenAI for question generation and interview scoring
- Tailwind CSS for styling
- Framer Motion and Lucide React for UI polish

## Project Flow

1. A user signs up with Clerk.
2. The onboarding page stores their role as candidate or recruiter.
3. A recruiter creates an organization.
4. The recruiter creates a job and can generate interview questions with OpenAI.
5. The app creates a unique interview token for the job.
6. The recruiter shares `/interview/[token]` with candidates.
7. A candidate submits answers through the public interview page.
8. The server stores the transcript and scores it.
9. Recruiters review candidates, analytics, and job-specific results.

## Learning Map

- `app/layout.js`: global providers, fonts, and app shell setup.
- `middleware.js`: Clerk authentication and role-based route protection.
- `lib/roles.js`: reusable role detection helpers.
- `lib/supabase.js`: server-side Supabase client.
- `app/api/set-role/route.js`: role onboarding API route.
- `app/api/webhooks/clerk/route.js`: Clerk-to-Supabase user sync.
- `app/actions/jobs.js`: job creation, AI question generation, job fetching.
- `app/actions/interview.js`: candidate submission, scoring, analytics.
- `app/dashboard/*`: recruiter/admin/candidate product screens.
- `app/interview/[token]`: public candidate interview experience.
- `database/schema.sql`: database tables, constraints, indexes, and RLS baseline.

## Setup

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in these required values:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the Supabase SQL from `database/schema.sql`, then start the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Portfolio Notes

This project demonstrates a complete SaaS-style workflow: auth, roles, protected dashboards, server actions, AI integration, relational data modeling, public tokenized flows, and analytics. For a production deployment, rotate any previously exposed keys, configure Clerk webhooks, add tests, and connect a real Vapi voice-call webhook if voice interviews are required.
