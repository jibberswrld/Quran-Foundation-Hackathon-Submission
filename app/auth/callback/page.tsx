import type { Metadata } from "next";
import AuthCallbackClient from "./AuthCallbackClient";

export const metadata: Metadata = {
  title: "Confirming… · Quran Coach",
};

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-start justify-center pt-24">
      <AuthCallbackClient />
    </div>
  );
}
