"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

interface ScoreDistributionChartProps {
  data: { range: string; count: number }[];
}

const COLORS = [
  "#10b981", // 90-100 emerald
  "#34d399", // 80-89
  "#f59e0b", // 70-79 amber
  "#fb923c", // 60-69 orange
  "#f97316", // 50-59
  "#ef4444", // <50 red
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs font-semibold text-zinc-300">
          Score {label}
        </p>
        <p className="text-sm font-bold text-violet-400">
          {payload[0].value} jobs
        </p>
      </div>
    );
  }
  return null;
};

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-3 rounded-xl h-full flex flex-col"
    >
      <div className="mb-2 shrink-0">
        <h3 className="text-sm font-semibold text-zinc-200">Score Distribution</h3>
        <p className="text-xs text-zinc-500 mt-0.5">AI match quality across all jobs</p>
      </div>
      <div className="flex-1 min-h-0 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="10%" maxBarSize={40}>
          <XAxis
            dataKey="range"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={25}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
