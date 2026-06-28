import { Redis } from "@upstash/redis";

/**
 * Shared Upstash Redis instance.
 * Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env automatically.
 */
export const redis = Redis.fromEnv();
