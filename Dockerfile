# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Install production dependencies only
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

# libc6-compat: required by some native Node modules (sharp, canvas, etc.)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy manifests first → Docker caches this layer until they change
COPY package.json package-lock.json* ./

# ci: clean install, respects lockfile exactly — safe for reproducible builds
# omit=dev: skip devDependencies in this stage (only used in builder stage)
RUN npm ci --omit=dev --frozen-lockfile

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Build the Next.js application
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install ALL deps (including devDeps) for the TypeScript/ESLint build step
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

# Copy application source
COPY . .

# ── Build-time environment variables ──────────────────────────────────────
# NEXT_PUBLIC_* vars are embedded into the JS bundle at build time.
# They are passed as Docker build ARGs from docker-compose → Dockerfile.
# NON-public vars (SUPABASE_SERVICE_ROLE_KEY) are runtime-only and must
# NOT be passed here — they should never appear in the built JS bundle.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# next build produces .next/standalone — a self-contained server
# (requires output: 'standalone' in next.config.ts, which is already set)
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Production runner (lean image, no source or devDeps)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Security hardening: run as non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Create logs directory with correct ownership
RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# ── Copy ONLY what is needed to run the standalone server ─────────────────
# standalone/ contains server.js + minimal node_modules (no full copy needed)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

USER nextjs

EXPOSE 3000

# Healthcheck baked into the image (docker-compose also defines one)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start the standalone server directly.
# Docker restart: always (in docker-compose) handles crash recovery + reboot.
# PM2 inside the container is unnecessary and wastes memory.
CMD ["node", "server.js"]
