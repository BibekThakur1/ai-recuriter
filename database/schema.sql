-- Organizations Table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  hiring_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- Clerk User ID
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'candidate',
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  recruiter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  experience_level TEXT,
  interview_type TEXT,
  ai_questions JSONB,
  interview_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Interviews Table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_resume_url TEXT,
  transcript TEXT,
  communication_score INTEGER,
  technical_score INTEGER,
  confidence_score INTEGER,
  cultural_fit_score INTEGER,
  overall_score INTEGER,
  hiring_recommendation TEXT,
  ai_summary TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Deny all access to public anonymous users
CREATE POLICY "Deny public access to organizations" ON organizations FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to users" ON users FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to jobs" ON jobs FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to interviews" ON interviews FOR ALL TO public USING (false);

-- The service_role key bypasses RLS by default, allowing Next.js backend to manage all data securely.
