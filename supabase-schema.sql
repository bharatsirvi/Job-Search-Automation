-- ================================================================
-- JobsAI - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ================================================================

-- ─── Jobs Table ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core job fields (populated by n8n pipeline)
  title TEXT NOT NULL,
  company_name TEXT,
  location TEXT,
  posted_at TIMESTAMPTZ,
  apply_url TEXT,
  linkedin_url TEXT,
  company_website TEXT,
  company_logo TEXT,
  company_linkedin_url TEXT,
  employment_type TEXT,
  seniority_field TEXT,
  
  -- AI fields (populated by n8n + OpenAI)
  score NUMERIC(5,2),
  short_reason TEXT,
  raw_json JSONB,
  
  -- User interaction fields (managed by frontend)
  applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMPTZ,
  bookmarked BOOLEAN DEFAULT FALSE,
  viewed BOOLEAN DEFAULT FALSE,
  hidden BOOLEAN DEFAULT FALSE,
  notes TEXT,
  tags TEXT[],
  application_status TEXT DEFAULT 'none'
    CHECK (application_status IN ('none','applied','interviewing','rejected','offer','ghosted')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read jobs (adjust if you want per-user data)
CREATE POLICY "Anyone can read jobs"
  ON public.jobs
  FOR SELECT
  USING (true);

-- Only authenticated users can update jobs
CREATE POLICY "Authenticated users can update jobs"
  ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow the service role to insert (n8n uses service role key)
CREATE POLICY "Service role can insert jobs"
  ON public.jobs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_jobs_score ON public.jobs(score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON public.jobs(posted_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_bookmarked ON public.jobs(bookmarked) WHERE bookmarked = true;
CREATE INDEX IF NOT EXISTS idx_jobs_applied ON public.jobs(applied) WHERE applied = true;
CREATE INDEX IF NOT EXISTS idx_jobs_hidden ON public.jobs(hidden) WHERE hidden = false;
CREATE INDEX IF NOT EXISTS idx_jobs_application_status ON public.jobs(application_status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON public.jobs(company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_search ON public.jobs
  USING gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(company_name,'') || ' ' || coalesce(short_reason,'')));

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable Realtime on the jobs table via Supabase Dashboard:
-- Database > Replication > Add table > public.jobs
-- Or run:
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;

-- ─── Sample data (optional, for testing) ─────────────────────────────────────
-- INSERT INTO public.jobs (
--   title, company_name, location, employment_type, seniority_field,
--   score, short_reason, apply_url, posted_at
-- ) VALUES (
--   'Senior Frontend Engineer',
--   'Acme Corp',
--   'San Francisco, CA (Remote)',
--   'full_time',
--   'Senior',
--   87.5,
--   'Strong match: React, TypeScript, and Next.js skills align perfectly with requirements. Remote-friendly role.',
--   'https://example.com/apply',
--   NOW() - INTERVAL '2 days'
-- );
