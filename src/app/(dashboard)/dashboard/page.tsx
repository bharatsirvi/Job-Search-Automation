"use client";

import { useDashboardStats } from "@/hooks/useJobs";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/StatCard";
import { ScoreDistributionChart } from "@/components/dashboard/ScoreDistributionChart";
import { TopCompanies } from "@/components/dashboard/TopCompanies";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  Briefcase,
  CheckCircle,
  TrendingUp,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { user } = useAuth();

  const greeting = () => {
    // Get current time in Indian Standard Time (UTC+5:30)
    const now = new Date();
    const istTime = new Date(now.getTime() + 19800000); // 5.5 hours in ms
    const h = istTime.getUTCHours();
    
    // 4 AM to 12 PM -> Morning
    if (h >= 4 && h < 12) return "Good morning";
    // 12 PM to 5 PM -> Afternoon
    if (h >= 12 && h < 17) return "Good afternoon";
    // 5 PM to 4 AM -> Evening
    return "Good evening";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4 pb-2 pr-2">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {greeting()},{" "}
            <span className="gradient-text">
              {user?.user_metadata?.full_name?.split(" ")[0] || "there"}
            </span>{" "}
            👋
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Here&apos;s your job search overview
          </p>
        </div>
        <Link
          href="/jobs"
          id="browse-jobs-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-900/30"
        >
          <Sparkles className="w-4 h-4" />
          Browse Jobs
        </Link>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Left Column (More Space) */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Stats Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <StatCard
                  title="Total Jobs"
                  value={stats?.totalJobs ?? 0}
                  icon={Briefcase}
                  iconColor="text-violet-400"
                  delay={0}
                  subtitle="In your pipeline"
                />
                <StatCard
                  title="Applied"
                  value={stats?.appliedJobs ?? 0}
                  icon={CheckCircle}
                  iconColor="text-emerald-400"
                  delay={0.05}
                  subtitle="Applications sent"
                />
                <StatCard
                  title="Avg AI Score"
                  value={`${stats?.avgScore ?? 0}`}
                  icon={TrendingUp}
                  iconColor="text-sky-400"
                  delay={0.15}
                  subtitle="Match quality"
                />
                <StatCard
                  title="Added Today"
                  value={stats?.jobsToday ?? 0}
                  icon={Plus}
                  iconColor="text-pink-400"
                  delay={0.2}
                  subtitle="New opportunities"
                />
              </>
            )}
          </div>

          {/* Recent Activity */}
          <div className="flex-1 min-h-0">
            <RecentActivity jobs={stats?.recentActivity ?? []} loading={isLoading} />
          </div>
        </div>

        {/* Right Column (Less Space) */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
          {/* Score Distribution */}
          <div className="flex-1 min-h-0">
            {isLoading ? (
              <div className="glass-card p-6 rounded-xl h-full">
                <div className="skeleton h-4 w-40 rounded mb-2" />
                <div className="skeleton h-3 w-52 rounded mb-6" />
                <div className="skeleton h-24 w-full rounded" />
              </div>
            ) : (
              <ScoreDistributionChart data={stats?.scoreDistribution ?? []} />
            )}
          </div>

          {/* Top Companies */}
          <div className="shrink-0">
            {isLoading ? (
              <div className="glass-card p-6 rounded-xl">
                <div className="skeleton h-4 w-32 rounded mb-2" />
                <div className="skeleton h-3 w-44 rounded mb-6" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <div className="skeleton w-8 h-8 rounded-lg" />
                    <div className="flex-1">
                      <div className="skeleton h-3 w-full rounded mb-1" />
                      <div className="skeleton h-1.5 w-3/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <TopCompanies data={stats?.topCompanies ?? []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
