"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useJobStore, DEFAULT_FILTERS } from "@/stores/jobStore";
import { useInfiniteJobs } from "@/hooks/useJobs";
import { JobCard, JobCardSkeleton } from "@/components/jobs/JobCard";
import { ApplicationsFilterPanel } from "@/components/filters/ApplicationsFilterPanel";
import { SortControls } from "@/components/filters/SortControls";
import { exportToCSV } from "@/lib/supabase/queries";
import { BulkActionsBar } from "@/components/jobs/BulkActionsBar";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Download,
  LayoutGrid,
  List,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApplicationsPage() {
  const { sort, selectedIds, toggleSelectedId } = useJobStore();
  const { filters: globalFilters } = useJobStore();
  
  // We force `applied: true` for this page, but inherit the rest from the store
  const filters = {
    ...globalFilters,
    applied: true,
  };

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteJobs(filters, sort === "score" ? "applied_at" : sort);

  const allJobs = data?.pages.flatMap((p) => p.jobs) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  const handleExport = () => {
    const selected = allJobs.filter((j) => selectedIds.includes(j.id));
    exportToCSV(selected.length > 0 ? selected : allJobs);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-shrink-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Application Tracker</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track your job applications and their status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          {/* View Toggle */}
          <div className="flex items-center gap-0.5 p-1 bg-zinc-800 rounded-lg border border-zinc-700">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-zinc-700 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-400"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-zinc-700 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-400"
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* Filter Panel */}
        <div className="h-full overflow-y-auto no-scrollbar">
          <ApplicationsFilterPanel />
        </div>

        {/* Job List */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          {/* Sort Controls */}
          <div className="flex-shrink-0 z-10 relative">
            <SortControls total={totalCount} showing={allJobs.length} />
          </div>

          <div 
            className="flex-1 overflow-y-auto min-h-0 pr-2 pt-4 [mask-image:linear-gradient(to_bottom,transparent,black_16px,black_100%)]" 
            id="job-scroll-container"
          >
          {/* Loading state */}
          {isLoading ? (
            <div
              className={cn(
                "grid gap-4",
                viewMode === "grid"
                  ? "grid-cols-1 xl:grid-cols-2"
                  : "grid-cols-1"
              )}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : allJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-300 mb-2">
                No applications found
              </h3>
              <p className="text-zinc-600 text-sm max-w-md">
                Try adjusting your filters, or browse more jobs to apply.
              </p>
            </motion.div>
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid"
                    ? "grid-cols-1 xl:grid-cols-2"
                    : "grid-cols-1"
                )}
              >
                {allJobs.map((job, i) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    index={i}
                    selected={selectedIds.includes(job.id)}
                    onSelect={toggleSelectedId}
                    showAppliedDate={true}
                  />
                ))}
              </div>

              {/* Load More Trigger */}
              <div ref={loadMoreRef} className="py-2 flex items-center justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <div className="w-4 h-4 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
                    Loading more...
                  </div>
                )}
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <BulkActionsBar
        allJobs={allJobs}
        visibleIds={allJobs.map((j) => j.id)}
        hideMarkApplied={true}
      />
    </div>
  );
}
