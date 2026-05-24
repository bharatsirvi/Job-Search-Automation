"use client";

import { Search, Bell, Sun, Moon, Command } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useJobStore } from "@/stores/jobStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  sidebarCollapsed: boolean;
  title?: string;
}

export function Header({ sidebarCollapsed, title }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const { setFilters, hasNewNotification, setHasNewNotification } = useJobStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ search: value });
    if (value && !window.location.pathname.includes("/jobs")) {
      router.push("/jobs");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 z-30 flex items-center gap-4 px-6 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      {/* Title */}
      {title && (
        <h1 className="text-base font-semibold text-zinc-200 hidden md:block mr-4">
          {title}
        </h1>
      )}

      {/* Search */}
      <div className={cn(
        "flex-1 max-w-lg relative transition-all duration-200",
        searchFocused && "max-w-xl"
      )}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          id="global-search"
          type="text"
          placeholder="Search jobs, companies..."
          onChange={handleSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-9 pr-10 py-2 text-sm bg-zinc-800/50 border border-zinc-700/60 rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification placeholder */}
        <button
          id="notifications-btn"
          onClick={() => setHasNewNotification(false)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer relative"
        >
          <Bell className="w-4 h-4" />
          {hasNewNotification && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full pulse-dot" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
        >
          {!mounted ? (
            <div className="w-4 h-4" />
          ) : theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
