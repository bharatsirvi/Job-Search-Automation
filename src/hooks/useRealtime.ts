import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "./useJobs";
import type { JobFilters, SortField } from "@/types";
import toast from "react-hot-toast";
import { useJobStore } from "@/stores/jobStore";

// Module-level singleton — avoids recreating the client on every render
const supabase = createClient();

export function useRealtimeJobs(
  filters: Partial<JobFilters>,
  sort: SortField
) {
  const qc = useQueryClient();
  // Refs to hold the latest filters/sort without re-subscribing on every change
  const filtersRef = useRef(filters);
  const sortRef = useRef(sort);

  useEffect(() => {
    // Sync latest values inside the effect (not during render)
    filtersRef.current = filters;
    sortRef.current = sort;
  }); // no dep array = runs after every render, safely inside effect

  useEffect(() => {
    const channel = supabase
      .channel("jobs-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "jobs" },
        () => {
          qc.invalidateQueries({ queryKey: queryKeys.jobsInfinite(filtersRef.current, sortRef.current) });
          qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
          toast("✨ New job added!", {
            icon: "🎯",
            style: {
              background: "#18181b",
              color: "#e4e4e7",
              border: "1px solid #27272a",
            },
          });
          useJobStore.getState().setHasNewNotification(true);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "jobs" },
        (payload) => {
          const jobId = payload.new?.id;
          if (jobId) {
            qc.invalidateQueries({ queryKey: queryKeys.job(jobId) });
            qc.invalidateQueries({ queryKey: queryKeys.jobsInfinite(filtersRef.current, sortRef.current) });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]); // qc is stable; supabase is module-level; filters/sort read via refs
}
