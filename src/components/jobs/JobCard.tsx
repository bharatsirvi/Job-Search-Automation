"use client";

import { motion } from "framer-motion";

import type { Job } from "@/types";
import Image from "next/image";
import {
  formatRelativeDate,
  getScoreBg,
  formatScore,
  getInitials,
  cn,
} from "@/lib/utils";
import {
  MapPin,
  ExternalLink,
  CheckCircle,
  MoreHorizontal,
  Clock,
  Sparkles,
  Trash2,
  Globe,
  Link2,
} from "lucide-react";
import {
  useApplyToJob,
  useDeleteJob,
} from "@/hooks/useJobs";
import { useState, useRef, useEffect } from "react";

interface JobCardProps {
  job: Job;
  index?: number;
  selected?: boolean;
  onSelect?: (id: string) => void;
  showAppliedDate?: boolean;
}

export function JobCard({
  job,
  index = 0,
  selected = false,
  onSelect,
  showAppliedDate = false,
}: JobCardProps) {
  const { mutate: applyToJob, isPending: applying } = useApplyToJob();
  const { mutate: deleteJob } = useDeleteJob();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (job.apply_url) {
      window.open(job.apply_url, "_blank", "noopener,noreferrer");
    }
    applyToJob(job.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this job permanently?")) {
      deleteJob(job.id);
    }
    setMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
      className={cn(
        "glass-card rounded-xl p-5 relative group transition-all duration-200 flex flex-col h-full",
        selected && "border-violet-500/50 ring-1 ring-violet-500/20"
      )}
    >
      {/* Select checkbox */}
      {onSelect && (
        <div
          className="absolute top-4 left-4 z-10"
          onClick={(e) => { e.preventDefault(); onSelect(job.id); }}
        >
          <div className={cn(
            "w-4 h-4 rounded border cursor-pointer transition-all",
            selected
              ? "bg-violet-600 border-violet-500"
              : "border-zinc-700 hover:border-violet-500 bg-transparent"
          )}>
            {selected && (
              <svg viewBox="0 0 14 14" fill="none" className="w-full h-full p-0.5">
                <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      )}

      <div id={`job-card-${job.id}`}>
        <div className={cn("space-y-4", onSelect && "pl-6")}>
          {/* Header Row */}
          <div className="flex items-start gap-3">
            {/* Company Logo */}
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.company_logo ? (
                <Image
                  src={job.company_logo}
                  alt={job.company_name || ""}
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                  unoptimized
                />
              ) : (
                <span className="text-sm font-bold text-zinc-400 uppercase">
                  {getInitials(job.company_name)}
                </span>
              )}
            </div>

            {/* Title + Company */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-zinc-100 leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
                {job.title}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5 truncate">
                {job.company_name}
              </p>
            </div>

            {/* Score Badge */}
            <div
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0",
                getScoreBg(job.score)
              )}
            >
              {formatScore(job.score)}
            </div>
          </div>

          {/* AI Reason */}
          {job.short_reason && (
            <div className="flex items-start gap-2 bg-zinc-800/40 rounded-lg px-3 py-2 border border-zinc-700/40">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {job.short_reason}
              </p>
            </div>
          )}

          {/* Meta Rows */}
          <div className="flex flex-col gap-y-1.5 text-xs text-zinc-500 pb-2">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
            )}
            {showAppliedDate ? (
              job.applied_at && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Applied {formatRelativeDate(job.applied_at)}
                </span>
              )
            ) : (
              job.posted_at && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeDate(job.posted_at)}
                </span>
              )
            )}
          </div>


        </div>
      </div>

      {/* Actions Row */}
      <div className="mt-auto pt-4 border-t border-zinc-800/60 flex items-center gap-2">
        {/* Apply Button */}
        {job.applied ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Applied
          </div>
        ) : (
          <button
            id={`apply-btn-${job.id}`}
            onClick={handleApply}
            disabled={applying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {applying ? "Applying…" : "Apply"}
          </button>
        )}

        {/* More menu */}
        <div className="relative ml-auto" ref={menuRef}>
          <button
            id={`more-btn-${job.id}`}
            onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-40 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Job
                </button>
                <div className="p-1">
                  {job.applied ? (
                    job.apply_url && (
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                        Apply Link
                      </a>
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        applyToJob(job.id);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Mark Applied
                    </button>
                  )}
                  <div className="h-px bg-zinc-800 my-1 mx-2" />
                  {job.company_website && (
                    <a
                      href={job.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Globe className="w-4 h-4 text-zinc-400" />
                      Website
                    </a>
                  )}
                  {job.company_linkedin_url && (
                    <a
                      href={job.company_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-blue-400" />
                      LinkedIn
                    </a>
                  )}
                  {job.linkedin_url && (
                    <a
                      href={job.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                      Job on LinkedIn
                    </a>
                  )}
                </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function JobCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="skeleton w-11 h-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
        <div className="skeleton h-7 w-12 rounded-lg" />
      </div>
      <div className="skeleton h-10 w-full rounded-lg" />
      <div className="flex gap-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
      <div className="pt-4 border-t border-zinc-800/60 flex gap-2">
        <div className="skeleton h-8 w-20 rounded-lg" />
        <div className="skeleton h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}
