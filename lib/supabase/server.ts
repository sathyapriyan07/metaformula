import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const RETRY_DELAYS_MS = [0, 700];
const FETCH_TIMEOUT_MS = 20000;

async function resilientFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (let i = 0; i < RETRY_DELAYS_MS.length; i += 1) {
    if (RETRY_DELAYS_MS[i] > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[i]));
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(input, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
    }
  }

  throw lastError;
}

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      global: { fetch: resilientFetch },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      global: { fetch: resilientFetch },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
