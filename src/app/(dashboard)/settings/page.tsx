"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl h-full overflow-y-auto pb-8 pr-2">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-200">Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-xl font-bold text-violet-400 uppercase">
            {user?.email?.[0] || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{user?.email}</p>
            <p className="text-xs text-zinc-700 mt-0.5">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>
      </motion.div>


      {/* Database info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-200">About</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Platform</span>
            <span className="text-zinc-300 font-medium">JobsAI</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Backend</span>
            <span className="text-zinc-300 font-medium">Supabase + n8n</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">AI Engine</span>
            <span className="text-zinc-300 font-medium">OpenAI via n8n</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Version</span>
            <span className="text-zinc-300 font-medium">1.0.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
