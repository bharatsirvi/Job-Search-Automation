import { createClient } from "@/lib/supabase/client";
import type {
  Job,
  JobFilters,
  SortField,
  DashboardStats,
} from "@/types";

const supabase = createClient();

// ─── Job Queries ─────────────────────────────────────────────────────────────

export async function fetchJobs(
  filters: Partial<JobFilters>,
  sort: SortField = "score",
  page = 0,
  pageSize = 20
): Promise<{ jobs: Job[]; count: number }> {
  let query = supabase
    .from("jobs")
    .select("*", { count: "exact" });

  // Search
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`
    );
  }

  // Minimum Score
  if (filters.minScore && filters.minScore > 0) {
    query = query.gte("score", filters.minScore);
  }

  // Location
  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  // Company
  if (filters.company) {
    query = query.ilike("company_name", `%${filters.company}%`);
  }

  // Posted after
  if (filters.postedAfter) {
    query = query.gte("posted_at", filters.postedAfter);
  }

  // Applied after
  if (filters.appliedAfter) {
    query = query.gte("applied_at", filters.appliedAfter);
  }

  // Applied
  if (filters.applied === true) {
    query = query.eq("applied", true);
  } else if (filters.applied === false) {
    query = query.or("applied.eq.false,applied.is.null");
  }


  // Sorting
  switch (sort) {
    case "score":
      query = query.order("score", { ascending: false });
      break;
    case "posted_at_desc":
      query = query.order("posted_at", { ascending: false });
      break;
    case "posted_at_asc":
      query = query.order("posted_at", { ascending: true });
      break;
    case "applied_at":
      query = query.order("applied_at", { ascending: false });
      break;
    default:
      query = query.order("score", { ascending: false });
  }

  // Pagination
  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;
  return { jobs: (data as Job[]) || [], count: count || 0 };
}

export async function fetchJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Job;
}

export async function fetchRelatedJobs(
  job: Job,
  limit = 4
): Promise<Job[]> {
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .neq("id", job.id)
    .gte("score", (job.score || 0) - 20)
    .order("score", { ascending: false })
    .limit(limit);

  return (data as Job[]) || [];
}

// ─── Job Mutations ────────────────────────────────────────────────────────────

export async function updateJobField(
  id: string,
  updates: Partial<Job>
): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function applyToJob(id: string): Promise<Job> {
  return updateJobField(id, {
    applied: true,
    applied_at: new Date().toISOString(),
  });
}


export async function updateNotes(
  id: string,
  notes: string
): Promise<Job> {
  return updateJobField(id, { notes });
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw error;
}

export async function markViewed(id: string): Promise<void> {
  await supabase
    .from("jobs")
    .update({ viewed: true })
    .eq("id", id);
}

// ─── Bulk Actions ─────────────────────────────────────────────────────────────

export async function bulkMarkApplied(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from("jobs")
    .update({ 
      applied: true, 
      applied_at: new Date().toISOString()
    })
    .in("id", ids);
  if (error) throw error;
}

export async function bulkDeleteJobs(ids: string[]): Promise<void> {
  const { error } = await supabase.from("jobs").delete().in("id", ids);
  if (error) throw error;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { count: totalJobs },
    { count: appliedJobs },
    { data: scoreData },
    { count: jobsToday },
    { data: topCompaniesData },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("applied", true),
    supabase.from("jobs").select("score").not("score", "is", null),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase
      .from("jobs")
      .select("company_name")
      .not("company_name", "is", null),
    supabase
      .from("jobs")
      .select("*")
      .eq("applied", true)
      .order("applied_at", { ascending: false })
      .limit(5),
  ]);

  // Avg score
  const scores = scoreData?.map((j) => j.score || 0) || [];
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  // Score distribution
  const scoreDistribution = [
    { range: "90-100", count: scores.filter((s) => s >= 90).length },
    { range: "80-89", count: scores.filter((s) => s >= 80 && s < 90).length },
    { range: "70-79", count: scores.filter((s) => s >= 70 && s < 80).length },
    { range: "60-69", count: scores.filter((s) => s >= 60 && s < 70).length },
    { range: "50-59", count: scores.filter((s) => s >= 50 && s < 60).length },
    { range: "<50", count: scores.filter((s) => s < 50).length },
  ];

  // Top companies
  const companyCounts: Record<string, number> = {};
  topCompaniesData?.forEach((j) => {
    if (j.company_name) {
      companyCounts[j.company_name] = (companyCounts[j.company_name] || 0) + 1;
    }
  });
  const topCompanies = Object.entries(companyCounts)
    .map(([company_name, count]) => ({ company_name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalJobs: totalJobs || 0,
    appliedJobs: appliedJobs || 0,
    avgScore,
    jobsToday: jobsToday || 0,
    topCompanies,
    scoreDistribution,
    recentActivity: (recentActivity as Job[]) || [],
  };
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportToCSV(jobs: Job[]): void {
  const headers = [
    "Title",
    "Company",
    "Location",
    "Score",
    "Posted At",
    "LinkedIn URL",
    "Apply URL",
  ];

  const rows = jobs.map((j) => [
    j.title,
    j.company_name || "",
    j.location || "",
    j.score || "",
    j.posted_at ? new Date(j.posted_at).toLocaleDateString() : "",
    j.linkedin_url || "",
    j.apply_url || "",
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jobs_export_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
