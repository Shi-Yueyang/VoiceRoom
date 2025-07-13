export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
} as const;
