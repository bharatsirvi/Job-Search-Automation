"use client";

import { useState } from "react";
import { useJobStore } from "@/stores/jobStore";
import { cn } from "@/lib/utils";
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DATE_OPTIONS = [
  { value: null, label: "Any time" },
  { value: new Date(Date.now() - 86400000).toISOString(), label: "Last 24 hours" },
  { value: new Date(Date.now() - 86400000 * 7).toISOString(), label: "Last 7 days" },
  { value: new Date(Date.now() - 86400000 * 30).toISOString(), label: "Last 30 days" },
];

export function ApplicationsFilterPanel() {
  const { filters, setFilters, resetFilters } = useJobStore();
  const [sections, setSections] = useState<Record<string, boolean>>({
    score: true,
    date: true,
  });

  const toggleSection = (key: string) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const hasActiveFilters =
    filters.minScore > 0 ||
    filters.search ||
    filters.appliedAfter;

  return (
    <aside className="w-72 flex-shrink-0 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-300">Filters</span>
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 text-xs bg-violet-600 text-white rounded font-medium">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters({ search: "", minScore: 0, appliedAfter: null })}
            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Search Applied Jobs */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Search Applied Jobs
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Job title, company..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Min Score */}
      <FilterSection
        title="Minimum Score"
        sectionKey="score"
        open={sections.score}
        onToggle={() => toggleSection("score")}
      >
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Min: {filters.minScore > 0 ? `${filters.minScore}%` : "Any"}</span>
            <span className="text-zinc-600">Max: 100%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.minScore}
            onChange={(e) => setFilters({ minScore: Number(e.target.value) })}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 font-medium px-0.5">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </FilterSection>

      {/* Applied Date */}
      <FilterSection
        title="Applied Date"
        sectionKey="date"
        open={sections.date}
        onToggle={() => toggleSection("date")}
      >
        <div className="space-y-1">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setFilters({ appliedAfter: opt.value })}
              className={cn(
                "w-full text-left text-xs px-3 py-2 rounded-lg transition-all cursor-pointer",
                filters.appliedAfter === opt.value
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 border border-transparent"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  sectionKey: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-800/30 transition-colors"
      >
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-zinc-600" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
