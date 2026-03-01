﻿"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "../../../lib/supabase/client";
import { useReferenceStore } from "../../../store/references";
import { getUserRole } from "../../../lib/roles";

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Request timed out. Please try again.")), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useReferenceStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const supabase = createSupabaseBrowser();
      const { data, error: authError } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        15000
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        const role = getUserRole(data.user) === "admin" ? "admin" : "user";
        setUser({ id: data.user.id, email: data.user.email || "", role });
      }
      setSuccess("Login successful. Redirecting...");
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="glass-strong w-full max-w-md rounded-2xl p-8">
        <div className="label">Admin Access</div>
        <h1 className="mt-3 font-display text-3xl tracking-[0.2em]">Sign In</h1>
        <p className="mt-2 text-sm text-f1-muted">Use your admin credentials to manage the archive.</p>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-f1-bg/60 px-4 py-2 text-sm text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-f1-bg/60 px-4 py-2 text-sm text-white"
              required
            />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-f1-red">Login failed: {error}</p>}
        {success && <p className="mt-4 text-sm text-green-400">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full border border-f1-cyan/40 py-2 text-xs uppercase tracking-[0.2em] text-f1-cyan"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
