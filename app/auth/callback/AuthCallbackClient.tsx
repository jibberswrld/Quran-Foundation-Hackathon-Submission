"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

/** Supabase verifyOtp `type` for token_hash links */
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

/**
 * Finishes email / OAuth confirmation in the browser.
 *
 * Cross-browser: Supabase "confirm signup" must reach this URL with either
 * - #access_token=…&refresh_token=… (implicit / magic link), or
 * - ?token_hash=…&type=signup|email|… (recommended; set this in Dashboard →
 *   Authentication → Email Templates → Confirm signup → link URL), not only ?code=
 *   which is PKCE and tied to the browser where signup started.
 */
function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState<string>(
    "Confirming your account…"
  );
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
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });
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
            "This confirmation link uses a one-time code that only works in the same browser and session where you signed up. Open the link in that browser, or ask for a new confirmation email and update your Supabase “Confirm signup” template to use token_hash (see comments in AuthCallbackClient)."
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
        // Already signed in (e.g. revisiting callback) — don’t force onboarding again
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
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      {status === "working" ? (
        <p className="text-sm text-stone-500">{message}</p>
      ) : (
        <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-left text-sm text-red-800">
          <p className="font-semibold">Could not confirm</p>
          <p>{message}</p>
          <button
            type="button"
            onClick={() => router.replace("/auth/login")}
            className="text-emerald-700 underline"
          >
            Back to sign in
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
        <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-stone-500">
          Loading…
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
