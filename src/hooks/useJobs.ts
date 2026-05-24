import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchJobs,
  fetchJobById,
  fetchRelatedJobs,
  fetchDashboardStats,
  applyToJob,
  updateNotes,
  markViewed,
  bulkMarkApplied,
  deleteJob,
  bulkDeleteJobs,
} from "@/lib/supabase/queries";
import type { JobFilters, SortField } from "@/types";
import toast from "react-hot-toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const queryKeys = {
  jobs: (filters: Partial<JobFilters>, sort: SortField) =>
    ["jobs", filters, sort] as const,
  jobsInfinite: (filters: Partial<JobFilters>, sort: SortField) =>
    ["jobs-infinite", filters, sort] as const,
  job: (id: string) => ["job", id] as const,
  relatedJobs: (id: string) => ["related-jobs", id] as const,
  dashboard: () => ["dashboard"] as const,
};

// ─── Jobs List (Infinite) ─────────────────────────────────────────────────────
export function useInfiniteJobs(
  filters: Partial<JobFilters>,
  sort: SortField,
  pageSize = 20
) {
  return useInfiniteQuery({
    queryKey: queryKeys.jobsInfinite(filters, sort),
    queryFn: ({ pageParam = 0 }) =>
      fetchJobs(filters, sort, pageParam as number, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, p) => acc + p.jobs.length, 0);
      return loaded < lastPage.count ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Jobs List (Paginated) ────────────────────────────────────────────────────
export function useJobs(
  filters: Partial<JobFilters>,
  sort: SortField,
  page = 0,
  pageSize = 20
) {
  return useQuery({
    queryKey: [...queryKeys.jobs(filters, sort), page],
    queryFn: () => fetchJobs(filters, sort, page, pageSize),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });
}

// ─── Single Job ───────────────────────────────────────────────────────────────
export function useJob(id: string) {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: () => fetchJobById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}

// ─── Related Jobs ─────────────────────────────────────────────────────────────
export function useRelatedJobs(jobId: string) {
  const { data: job } = useJob(jobId);
  return useQuery({
    queryKey: queryKeys.relatedJobs(jobId),
    queryFn: () => fetchRelatedJobs(job!),
    enabled: !!job,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────
export function useApplyToJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applyToJob,
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs-infinite"] });
      qc.invalidateQueries({ queryKey: queryKeys.job(job.id) });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
      toast.success(`Applied to ${job.title}!`);
    },
    onError: () => toast.error("Failed to mark as applied"),
  });
}


export function useUpdateNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      updateNotes(id, notes),
    onSuccess: (job) => {
      qc.invalidateQueries({ queryKey: queryKeys.job(job.id) });
      toast.success("Notes saved");
    },
    onError: () => toast.error("Failed to save notes"),
  });
}

export function useMarkViewed() {
  return useMutation({ mutationFn: markViewed });
}

export function useBulkMarkApplied() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkMarkApplied,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs-infinite"] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
      toast.success("Jobs marked as applied");
    },
    onError: (error: Error) => toast.error(`Bulk apply failed: ${error.message}`),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs-infinite"] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
      toast.success("Job deleted successfully");
    },
    onError: () => toast.error("Failed to delete job"),
  });
}

export function useBulkDeleteJobs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteJobs,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs-infinite"] });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
      toast.success("Jobs deleted successfully");
    },
    onError: () => toast.error("Failed to delete jobs"),
  });
}
