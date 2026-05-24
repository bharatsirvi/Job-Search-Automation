"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-violet-400",
  trend,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={cn(
        "glass-card p-3 rounded-xl group cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-0.5">
            {title}
          </p>
          <p className="text-xl font-bold text-zinc-100 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-[10px] text-zinc-600 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
            "bg-zinc-800/80"
          )}
        >
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-semibold",
              trend.value >= 0 ? "text-emerald-400" : "text-red-400"
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-zinc-600">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="glass-card p-3 rounded-xl">
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1 space-y-1.5">
          <div className="skeleton h-2 w-16 rounded" />
          <div className="skeleton h-6 w-12 rounded" />
          <div className="skeleton h-2 w-20 rounded" />
        </div>
        <div className="skeleton w-8 h-8 rounded-lg" />
      </div>
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  );
}
