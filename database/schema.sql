CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  role TEXT NOT NULL DEFAULT 'candidate' CHECK (role IN ('candidate', 'recruiter', 'admin')),
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
  experience_level TEXT CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  interview_type TEXT CHECK (interview_type IN ('technical', 'behavioral', 'mixed')),
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
  candidate_phone TEXT,
  candidate_resume_url TEXT,
  candidate_resume_text TEXT,
  transcript TEXT,
  communication_score INTEGER CHECK (communication_score BETWEEN 0 AND 100),
  technical_score INTEGER CHECK (technical_score BETWEEN 0 AND 100),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  cultural_fit_score INTEGER CHECK (cultural_fit_score BETWEEN 0 AND 100),
  resume_score INTEGER CHECK (resume_score BETWEEN 0 AND 100),
  skill_match_score INTEGER CHECK (skill_match_score BETWEEN 0 AND 100),
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  hiring_recommendation TEXT,
  ai_summary TEXT,
  strengths TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  recruiter_notes TEXT,
  next_step TEXT,
  recording_url TEXT,
  source TEXT DEFAULT 'interview_link',
  application_stage TEXT NOT NULL DEFAULT 'screening' CHECK (application_stage IN ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Team Invitations Table
CREATE TABLE team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'recruiter' CHECK (role IN ('recruiter', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_jobs_organization_id ON jobs(organization_id);
CREATE INDEX idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX idx_jobs_interview_token ON jobs(interview_token);
CREATE INDEX idx_interviews_job_id ON interviews(job_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interviews_application_stage ON interviews(application_stage);
CREATE INDEX idx_interviews_candidate_email ON interviews(candidate_email);
CREATE INDEX idx_team_invitations_organization_id ON team_invitations(organization_id);
CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Deny all access to public anonymous users
CREATE POLICY "Deny public access to organizations" ON organizations FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to users" ON users FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to jobs" ON jobs FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to interviews" ON interviews FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to team invitations" ON team_invitations FOR ALL TO public USING (false);
CREATE POLICY "Deny public access to audit logs" ON audit_logs FOR ALL TO public USING (false);

-- The service_role key bypasses RLS by default, allowing Next.js backend to manage all data securely.
