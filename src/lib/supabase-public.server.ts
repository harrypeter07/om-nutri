import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { logServerEnvDiagnostics, requireServerEnv } from "./env.server";

/** Publishable-key client for server-side public reads/writes (RLS applies as anon). */
export function getPublicClient() {
  logServerEnvDiagnostics();
  const url = requireServerEnv("SUPABASE_URL");
  const key = requireServerEnv("SUPABASE_PUBLISHABLE_KEY");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
