"use client";

import { useJobStore } from "@/stores/jobStore";
import {
  useBulkMarkApplied,
  useBulkDeleteJobs,
} from "@/hooks/useJobs";
import { exportToCSV } from "@/lib/supabase/queries";
import type { Job } from "@/types";
import {
  CheckCircle,
  Download,
  X,
  Square,
  CheckSquare,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BulkActionsBarProps {
  allJobs: Job[];
  visibleIds: string[];
  hideMarkApplied?: boolean;
}

export function BulkActionsBar({ allJobs, visibleIds, hideMarkApplied = false }: BulkActionsBarProps) {
  const { selectedIds, clearSelectedIds, selectAllIds } = useJobStore();
  const { mutate: bulkApplied, isPending: applying } = useBulkMarkApplied();
  const { mutate: bulkDelete, isPending: deleting } = useBulkDeleteJobs();

  const isAllSelected = visibleIds.every((id) => selectedIds.includes(id));
  const count = selectedIds.length;

  const handleExport = () => {
    const selected = allJobs.filter((j) => selectedIds.includes(j.id));
    exportToCSV(selected.length > 0 ? selected : allJobs);
  };

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl backdrop-blur-xl"
        >
          <button
            onClick={() =>
              isAllSelected ? clearSelectedIds() : selectAllIds(visibleIds)
            }
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-violet-400" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span className="font-semibold text-violet-400">{count}</span>{" "}
            selected
          </button>

          <div className="w-px h-5 bg-zinc-700" />

          {!hideMarkApplied && (
            <button
              onClick={() => bulkApplied(selectedIds)}
              disabled={applying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 transition-all disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark Applied
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} jobs?`)) {
                bulkDelete(selectedIds);
                clearSelectedIds();
              }
            }}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 hover:text-red-400 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>

          <div className="w-px h-5 bg-zinc-700" />

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          <button
            onClick={clearSelectedIds}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
