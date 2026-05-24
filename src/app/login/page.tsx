"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Globe, Mail, Lock, ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = mode === "login" ? signInWithEmail : signUpWithEmail;
      const { error } = await fn(email, password);
      if (error) throw error;
      if (mode === "signup") toast.success("Check your email to confirm your account!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, label: "AI-Powered Matching", desc: "Jobs scored based on your resume" },
    { icon: Target, label: "Smart Filtering", desc: "Find exactly what you're looking for" },
    { icon: Zap, label: "Real-time Updates", desc: "New jobs appear instantly" },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-zinc-950 border-r border-zinc-800/50">
        {/* Gradient background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">JobsAI</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-auto mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Your AI-powered<br />
              <span className="text-violet-400">career co-pilot</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Discover jobs perfectly matched to your skills. Track applications, analyze AI insights, and land your dream role faster.
            </p>
          </motion.div>

          <div className="relative z-10 space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
                  <f.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">{f.label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800/50 shadow-2xl"
        >
          {/* Logo mobile */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">JobsAI</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-100 mb-2">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-zinc-400 text-sm">
              {mode === "login"
                ? "Sign in to your JobsAI dashboard"
                : "Start discovering AI-matched jobs"}
            </p>
          </div>

          <div className="mb-8">
            <button
              id="google-signin-btn"
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-200 text-sm font-medium hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-zinc-400" />
              Continue with Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 text-zinc-500 bg-zinc-900/90 rounded-full py-1">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium text-zinc-400">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-violet-900/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
