"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

interface DashboardLayoutInnerProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayoutInner({ children, title }: DashboardLayoutInnerProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen bg-zinc-950 overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Header sidebarCollapsed={collapsed} title={title} />
      <main
        className={cn(
          "pt-16 h-full transition-all duration-300 flex flex-col",
          collapsed ? "pl-16" : "pl-60"
        )}
      >
        <div className="p-6 pb-2 lg:p-8 lg:pb-4 max-w-[1600px] mx-auto w-full flex-1 min-h-0 flex flex-col relative">
          {children}
        </div>
      </main>
    </div>
  );
}
