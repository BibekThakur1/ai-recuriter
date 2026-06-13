-- Run this if you already created the original tables and want to upgrade them
-- without dropping existing data.

ALTER TABLE interviews ADD COLUMN IF NOT EXISTS candidate_phone TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS candidate_resume_text TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS resume_score INTEGER CHECK (resume_score BETWEEN 0 AND 100);
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS skill_match_score INTEGER CHECK (skill_match_score BETWEEN 0 AND 100);
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS strengths TEXT[] DEFAULT '{}';
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS concerns TEXT[] DEFAULT '{}';
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS recruiter_notes TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS next_step TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS recording_url TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'interview_link';
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS application_stage TEXT NOT NULL DEFAULT 'screening';
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'interviews_application_stage_check'
  ) THEN
    ALTER TABLE interviews ADD CONSTRAINT interviews_application_stage_check
    CHECK (application_stage IN ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'recruiter' CHECK (role IN ('recruiter', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny public access to team invitations"
ON team_invitations FOR ALL TO public USING (false);

CREATE POLICY "Deny public access to audit logs"
ON audit_logs FOR ALL TO public USING (false);

CREATE INDEX IF NOT EXISTS idx_interviews_application_stage ON interviews(application_stage);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_email ON interviews(candidate_email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_organization_id ON team_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
