import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

// next/font automatically self-hosts Inter — no external network request,
// no layout shift, and fixes the @next/next/no-page-custom-font lint warning.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "JobsAI — AI-Powered Job Recommendations",
    template: "%s | JobsAI",
  },
  description:
    "Discover your perfect job with AI-powered matching. Browse, filter, and track applications with intelligent insights.",
  keywords: ["jobs", "AI", "job recommendations", "career", "employment"],
  openGraph: {
    title: "JobsAI — AI-Powered Job Recommendations",
    description: "Discover your perfect job with AI-powered matching.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
