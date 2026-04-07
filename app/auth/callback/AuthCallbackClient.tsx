"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type VerifyOtpType =
  | "signup"
  | "email"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change";

const DEFAULT_NEXT = "/onboarding";

function isSafeRelativePath(path: string): path is `/${string}` {
  return path.startsWith("/") && !path.startsWith("//");
}

function normalizeNext(raw: string | null): `/${string}` {
  if (raw && isSafeRelativePath(raw)) return raw;
  return DEFAULT_NEXT;
}

function parseHashParams(hash: string): URLSearchParams {
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(normalized);
}

const OTP_TYPES: readonly VerifyOtpType[] = [
  "signup",
  "email",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
];

function parseOtpType(raw: string | null): VerifyOtpType | null {
  if (!raw) return null;
  return OTP_TYPES.includes(raw as VerifyOtpType) ? (raw as VerifyOtpType) : null;
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState<string>("Confirming your account…");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const next = normalizeNext(searchParams.get("next"));

    async function complete() {
      const supabase = createBrowserSupabaseClient();

      const token_hash = searchParams.get("token_hash");
      const type = parseOtpType(searchParams.get("type"));
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setMessage(
            "This confirmation link uses a one-time code that only works in the same browser and session where you signed up. Open the link in that browser, or ask for a new confirmation email and update your Supabase \u201cConfirm signup\u201d template to use token_hash."
          );
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      if (typeof window !== "undefined" && window.location.hash) {
        const hp = parseHashParams(window.location.hash);
        const access_token = hp.get("access_token");
        const refresh_token = hp.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}`
          );
          router.replace(next);
          router.refresh();
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/");
        router.refresh();
        return;
      }

      setStatus("error");
      setMessage(
        "Invalid or expired link. Request a new confirmation email from the sign-in page, or sign up again."
      );
    }

    void complete();
  }, [router, searchParams]);

  return (
    <div className="mx-auto w-full max-w-md px-4 text-center">
      {status === "working" ? (
        <div className="space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
            ☽
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-300">{message}</p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-red-950/30 p-6 text-left">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
          <p className="mb-2 font-semibold text-red-400">Could not confirm</p>
          <p className="mb-4 text-sm text-red-500/80">{message}</p>
          <button
            type="button"
            onClick={() => router.replace("/auth/login")}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-md px-4 text-center">
          <div className="skeleton mx-auto mb-4 h-12 w-12 rounded-2xl" />
          <div className="skeleton mx-auto h-4 w-40 rounded" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
