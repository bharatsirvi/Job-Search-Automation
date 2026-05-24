/**
 * PM2 ecosystem config — Job Recommendation App
 *
 * NOTE: When running via Docker + docker-compose (recommended for EC2),
 * PM2 is NOT needed inside the container. Docker's `restart: always` policy
 * handles crash recovery, and the standalone server.js is started directly.
 *
 * This file is provided for:
 *   1. Bare-metal / non-Docker deployments
 *   2. CI/CD pipelines that deploy directly to the EC2 host (no Docker)
 *   3. Future hybrid setups
 *
 * To use: `pm2 start ecosystem.config.js --env production`
 */

module.exports = {
  apps: [
    {
      name: "job-recommendation-app",

      // For standalone build (output: 'standalone'):
      script: ".next/standalone/server.js",

      // For non-standalone builds, use:
      // script: "node_modules/.bin/next",
      // args:   "start",

      instances: "max",          // Use all available CPU cores (cluster mode)
      exec_mode: "cluster",

      // Auto-restart settings
      watch: false,              // Don't watch files in production
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,       // Wait 4s between restarts

      // Crash detection
      min_uptime: "10s",         // Must run 10s to be considered stable
      exp_backoff_restart_delay: 100,

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        // Environment variables are loaded from .env.local at OS level.
        // DO NOT hardcode secrets here.
      },

      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/pm2-error.log",
      out_file:   "./logs/pm2-out.log",
      merge_logs:  true,

      // Memory limit — restart if process exceeds threshold
      max_memory_restart: "400M",
    },
  ],
};
