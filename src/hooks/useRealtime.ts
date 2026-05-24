import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "./useJobs";
import type { JobFilters, SortField } from "@/types";
import toast from "react-hot-toast";
import { useJobStore } from "@/stores/jobStore";

export function useRealtimeJobs(
  filters: Partial<JobFilters>,
  sort: SortField
) {
  const qc = useQueryClient();
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("jobs-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "jobs" },
        () => {
          qc.invalidateQueries({ queryKey: queryKeys.jobsInfinite(filters, sort) });
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
            qc.invalidateQueries({ queryKey: queryKeys.jobsInfinite(filters, sort) });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
