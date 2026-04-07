import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Quran Coach",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-md space-y-4">
            <div className="skeleton mx-auto h-12 w-12 rounded-2xl" />
            <div className="skeleton h-64 w-full rounded-2xl" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
