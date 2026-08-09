/**
 * Server-side environment helpers.
 *
 * Every Supabase credential is read from the environment at request time — nothing
 * is hardcoded. When a variable is missing we log exactly which one and why the
 * page cannot render, so hosting logs (Vercel / Workers) show the real cause
 * instead of a generic "supabaseKey is required" / 500.
 */

type RuntimeEnv = Record<string, unknown>;

const SERVER_VARS = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"] as const;
const OPTIONAL_SERVER_VARS = ["SUPABASE_SERVICE_ROLE_KEY"] as const;

/**
 * Some hosts (Cloudflare Workers, and Vercel's edge runtime) pass environment
 * variables as the second argument to `fetch` instead of populating `process.env`.
 * Copy anything missing across so the rest of the app can rely on `process.env`.
 */
export function hydrateProcessEnvFromRuntime(env: unknown): void {
  if (!env || typeof env !== "object") return;
  const runtime = env as RuntimeEnv;
  const target = (globalThis as { process?: { env?: Record<string, string> } }).process?.env;
  if (!target) return;
  for (const [key, value] of Object.entries(runtime)) {
    if (typeof value === "string" && !target[key]) target[key] = value;
  }
  // Allow VITE_-prefixed values to satisfy the server-side names too.
  for (const name of [...SERVER_VARS, ...OPTIONAL_SERVER_VARS]) {
    const viteValue = target[`VITE_${name}`];
    if (!target[name] && typeof viteValue === "string") target[name] = viteValue;
  }
}

function readEnv(name: string): string | undefined {
  const value = process.env[name] ?? process.env[`VITE_${name}`];
  return value && value.length > 0 ? value : undefined;
}

/** Reads a required server env var, logging a precise reason before throwing. */
export function requireServerEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    const message =
      `[env] Missing required environment variable "${name}". ` +
      `The page cannot render because the database connection cannot be created. ` +
      `Set ${name} (and its VITE_ twin for browser code) in your hosting provider's ` +
      `environment variables, then redeploy.`;
    console.error(message);
    throw new Error(message);
  }
  return value;
}

let logged = false;

/** Logs a one-time summary of which server env vars are present/missing. */
export function logServerEnvDiagnostics(): void {
  if (logged) return;
  logged = true;
  const missing = SERVER_VARS.filter((name) => !readEnv(name));
  const missingOptional = OPTIONAL_SERVER_VARS.filter((name) => !readEnv(name));

  if (missing.length > 0) {
    console.error(
      `[env] Missing required variables: ${missing.join(", ")}. ` +
        `Server rendering and all database reads will fail with a 500 until these are set ` +
        `in the hosting environment (Project Settings → Environment Variables) and the app is redeployed.`,
    );
  } else {
    console.log("[env] Supabase server environment OK (URL + publishable key present).");
  }

  if (missingOptional.length > 0) {
    console.warn(
      `[env] Optional variables not set: ${missingOptional.join(", ")}. ` +
        `Checkout order writes and the admin dashboard need SUPABASE_SERVICE_ROLE_KEY.`,
    );
  }
}
