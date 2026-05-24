"use client";

import { useJobStore } from "@/stores/jobStore";
import type { SortField } from "@/types";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "score", label: "Best Match" },
  { value: "posted_at_desc", label: "Newest First" },
  { value: "posted_at_asc", label: "Oldest First" },
];

interface SortControlsProps {
  total: number;
  showing: number;
}

export function SortControls({ total, showing }: SortControlsProps) {
  const { sort, setSort } = useJobStore();
  const [open, setOpen] = useState(false);

  const current = SORT_OPTIONS.find((o) => o.value === sort);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-zinc-500">
        Showing{" "}
        <span className="font-semibold text-zinc-300">{showing}</span> of{" "}
        <span className="font-semibold text-zinc-300">{total}</span> jobs
      </p>

      <div className="relative">
        <button
          id="sort-dropdown"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-xs font-medium hover:border-zinc-600 transition-colors cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
          {current?.label}
          <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`sort-${opt.value}`}
                onClick={() => { setSort(opt.value); setOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-xs transition-colors cursor-pointer",
                  sort === opt.value
                    ? "text-violet-400 bg-violet-600/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
