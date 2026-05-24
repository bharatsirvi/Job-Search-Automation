import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | null): string {
  if (score === null || score === undefined) return "N/A";
  return `${Math.round(score)}`;
}

export function getScoreColor(score: number | null): string {
  if (!score) return "text-zinc-400";
  if (score >= 80) return "text-emerald-400";
  if (score >= 65) return "text-amber-400";
  if (score >= 50) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBg(score: number | null): string {
  if (!score) return "bg-zinc-800 text-zinc-400";
  if (score >= 80) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (score >= 65) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  if (score >= 50) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  return "bg-red-500/15 text-red-400 border-red-500/30";
}

export function getScoreLabel(score: number | null): string {
  if (!score) return "Unscored";
  if (score >= 80) return "Excellent Match";
  if (score >= 65) return "Good Match";
  if (score >= 50) return "Fair Match";
  return "Low Match";
}

export function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "Unknown";
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

export function formatDate(dateStr: string | null, fmt = "MMM d, yyyy"): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return "—";
  }
}




export function truncate(str: string | null, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function isValidUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
