"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface TopCompaniesProps {
  data: { company_name: string; count: number }[];
}

export function TopCompanies({ data }: TopCompaniesProps) {
  const displayData = data.slice(0, 5);
  const maxCount = Math.max(...displayData.map((c) => c.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-3 rounded-xl"
    >
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-zinc-200">Top Companies</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Most active employers</p>
      </div>
      <div className="space-y-2">
        {displayData.length === 0 && (
          <p className="text-sm text-zinc-600 text-center py-4">No data yet</p>
        )}
        {displayData.map((company, i) => (
          <motion.div
            key={company.company_name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="flex items-center gap-3"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-zinc-400 border border-zinc-700">
              {getInitials(company.company_name)}
            </div>
            {/* Name + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-300 truncate">
                  {company.company_name}
                </span>
                <span className="text-xs text-zinc-500 ml-2 flex-shrink-0">
                  {company.count}
                </span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(company.count / maxCount) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
