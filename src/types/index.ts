


export interface Job {
  id: string;
  title: string;
  company_name: string | null;
  location: string | null;
  posted_at: string | null;
  apply_url: string | null;
  linkedin_url: string | null;
  company_website: string | null;
  company_logo: string | null;
  company_linkedin_url: string | null;
  seniority_field: string | null;
  score: number | null;
  short_reason: string | null;
  raw_json: Record<string, unknown> | null;
  // Extended fields
  applied: boolean;
  applied_at: string | null;
  viewed: boolean;
  notes: string | null;
  tags: string[] | null;
}

export interface JobFilters {
  search: string;
  minScore: number;
  location: string;
  company: string;
  postedAfter: string | null;
  appliedAfter: string | null;
  applied: boolean | null;
}

export type SortField =
  | "score"
  | "posted_at_desc"
  | "posted_at_asc"
  | "applied_at";

export interface DashboardStats {
  totalJobs: number;
  appliedJobs: number;
  avgScore: number;
  jobsToday: number;
  topCompanies: { company_name: string; count: number }[];
  scoreDistribution: { range: string; count: number }[];
  recentActivity: Job[];
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<JobFilters>;
  sort: SortField;
  created_at: string;
}
