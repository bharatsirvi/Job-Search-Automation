"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    href: "/jobs",
    icon: Briefcase,
    label: "Browse Jobs",
    id: "nav-jobs",
  },
  {
    href: "/applications",
    icon: ClipboardList,
    label: "Applications",
    id: "nav-applications",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    id: "nav-dashboard",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    id: "nav-settings",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col border-r border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-zinc-800/60 gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <motion.span
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto", marginLeft: collapsed ? 0 : 12 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="font-bold text-zinc-100 text-base tracking-tight whitespace-nowrap overflow-hidden"
        >
          JobsAI
        </motion.span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} id={item.id}>
              <div
                className={cn(
                  "sidebar-link",
                  isActive && "active",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] flex-shrink-0 transition-colors",
                    isActive ? "text-violet-400" : "text-zinc-500"
                  )}
                />
                <motion.span
                  initial={false}
                  animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto", marginLeft: collapsed ? 0 : 12 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
                <motion.div
                  initial={false}
                  animate={{ scale: (isActive && !collapsed) ? 1 : 0, opacity: (isActive && !collapsed) ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0"
                />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-800/60 p-2 space-y-1">

        <button
          onClick={handleSignOut}
          id="signout-btn"
          className={cn(
            "sidebar-link w-full text-left",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0 text-zinc-500" />
          <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto", marginLeft: collapsed ? 0 : 12 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="whitespace-nowrap overflow-hidden"
          >
            Sign Out
          </motion.span>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        id="sidebar-toggle-btn"
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors z-10 cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-zinc-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-zinc-400" />
        )}
      </button>
    </motion.aside>
  );
}
