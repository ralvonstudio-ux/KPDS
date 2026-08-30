import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails fast in dev instead of silently hitting an undefined backend.
  // Copy .env.example to .env.local and fill in your Supabase project values.
  console.error(
    "[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your project credentials.",
  );
}

// Every Supabase call in this app — auth, every table query, every image
// upload — goes through this one client, and by default the underlying
// `fetch` has no timeout at all. On a flaky connection (mobile data, a
// congested network), a single stalled request just hangs forever, and
// since every page fetches something on mount, that hang shows up as "this
// page never finishes loading" anywhere in the app — not a per-page bug,
// a client-wide one. Capping every request here means the worst case
// becomes "falls back to the error/empty state after ~20s" instead of an
// indefinite spinner. 20s (not something tighter like 5s) because image
// uploads go through this same client and need real headroom on a slow
// connection even after client-side compression (see uploadPublicImage in
// src/lib/storage.ts).
const REQUEST_TIMEOUT_MS = 20_000;

// Defensive on purpose: this replaces the fetch every single Supabase call
// in the app goes through, so any way this could itself throw synchronously
// (an unsupported AbortSignal API, an unexpected signal shape) must never
// take the whole request pipeline down with it — worst case, fall back to
// a plain, untimed fetch (today's original behavior) rather than break
// something that worked before this file existed.
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const signal =
      init?.signal && typeof AbortSignal.any === "function"
        ? AbortSignal.any([init.signal, timeoutSignal])
        : timeoutSignal;
    return fetch(input, { ...init, signal });
  } catch (err) {
    console.error("[supabase] fetchWithTimeout setup failed, falling back to a plain fetch:", err);
    return fetch(input, init);
  }
}

export const supabase = createClient<Database>(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  },
);
