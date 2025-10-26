/**
 * Environment variable validation
 * Ensures all required environment variables are present
 */

import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid URL').optional(),

  // Authentication
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'STRIPE_PUBLISHABLE_KEY must start with pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET must start with whsec_').optional(),

  // Cloudflare R2
  R2_ACCESS_KEY_ID: z.string().min(1, 'R2_ACCESS_KEY_ID is required').optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1, 'R2_SECRET_ACCESS_KEY is required').optional(),
  R2_BUCKET_NAME: z.string().min(1, 'R2_BUCKET_NAME is required').optional(),
  R2_PUBLIC_URL: z.string().url('R2_PUBLIC_URL must be a valid URL').optional(),

  // Meilisearch
  MEILISEARCH_HOST: z.string().url('MEILISEARCH_HOST must be a valid URL').optional(),
  MEILISEARCH_API_KEY: z.string().min(1, 'MEILISEARCH_API_KEY is required').optional(),

  // Email
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required').optional(),

  // Monitoring
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),

  // Cron
  CRON_SECRET: z.string().min(32, 'CRON_SECRET must be at least 32 characters').optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Throws an error if validation fails
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');

      throw new Error(`Environment variable validation failed:\n${missingVars}`);
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Call this once at application startup
 */
export const env = validateEnv();
