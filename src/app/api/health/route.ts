import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Lightweight health check endpoint used by:
 *  - Docker healthcheck (docker-compose.yml)
 *  - Load balancers / uptime monitors
 *  - GitHub Actions post-deploy verification
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: process.env.NEXT_PUBLIC_APP_NAME ?? "JobsAI",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
