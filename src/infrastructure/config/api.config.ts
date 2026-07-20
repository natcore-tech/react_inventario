// src/infrastructure/config/api.config.ts

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'https://stock-master.nael.live/api',
  TIMEOUT: 10_000,
} as const