"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Job } from "@/types";
import { formatRelativeDate, getScoreBg, formatScore } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  jobs: Job[];
  loading: boolean;
}

export function RecentActivity({ jobs, loading }: RecentActivityProps) {
  const displayJobs = jobs.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-4 rounded-xl flex flex-col h-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">
            Recent Applications
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Your latest application activity
          </p>
        </div>
        <Link
          href="/applications"
          id="view-all-applications-btn"
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden pr-2">
        {loading ? (
          <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-zinc-800/50">
              <div className="skeleton w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-48 rounded" />
                <div className="skeleton h-3 w-32 rounded" />
              </div>
              <div className="skeleton h-5 w-10 rounded" />
            </div>
          ))}
        </div>
      ) : displayJobs.length === 0 ? (
        <div className="text-center py-10">
          <CheckCircle className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">No applications yet</p>
          <Link
            href="/jobs"
            className="mt-2 inline-block text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Browse jobs to get started →
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {displayJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.05 }}
            >
              <Link href={`/jobs/${job.id}`} id={`recent-job-${job.id}`}>
                <div className="flex items-center gap-4 py-3 px-3 -mx-3 rounded-lg hover:bg-zinc-800/50 transition-colors group">
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={job.company_name || ""}
                        className="w-8 h-8 object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xs font-bold text-zinc-500 uppercase">
                        {job.company_name?.[0] || "?"}
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-zinc-100 transition-colors">
                      {job.title}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {job.company_name} · Applied{" "}
                      {formatRelativeDate(job.applied_at)}
                    </p>
                  </div>
                  {/* Score */}
                  <div className={cn("px-2 py-0.5 rounded-md text-xs font-bold border", getScoreBg(job.score))}>
                    {formatScore(job.score)}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </motion.div>
  );
}
