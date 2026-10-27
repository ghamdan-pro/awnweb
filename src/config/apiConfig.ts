/**
 * @file apiConfig.ts
 * Centralized API and environment configuration for Awn Yemen (عون يمن).
 * Allows switching between Localhost, Vercel, and custom domains in ONE single place.
 */

// Production Vercel domain for Awn Yemen
export const VERCEL_API_BASE_URL = 'https://awnyemen.vercel.app/api/v1';
export const LOCAL_API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Determine the active API base URL:
 * 1. Checks VITE_API_URL environment variable if set.
 * 2. If running in a browser:
 *    - If on localhost: uses '/api/v1' or 'http://localhost:3000/api/v1'
 *    - If on Vercel / production: uses '/api/v1' or 'https://awnyemen.vercel.app/api/v1'
 */
const resolveApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (typeof window !== 'undefined') {
    // Relative path '/api/v1' works seamlessly across localhost, Vercel, and custom domains
    return '/api/v1';
  }
  
  return VERCEL_API_BASE_URL;
};

export const API_CONFIG = {
  // Primary endpoint used across all API calls
  BASE_URL: resolveApiBaseUrl(),
  
  // Explicit targets for reference or manual switching
  TARGET_VERCEL: VERCEL_API_BASE_URL,
  TARGET_LOCAL: LOCAL_API_BASE_URL,
  
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://uqpqierkeeewwydklvgg.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcHFpZXJrZWVld3d5ZGtsdmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDA0MDQsImV4cCI6MjEwODYxNjQwNH0.vpMbMKGhEyoF11sPa60AWnPlNMgK50STaNKIyv8K10U',
};
