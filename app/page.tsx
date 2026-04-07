/**
 * Root entry point. Client-side redirect is handled by RootRedirect so the
 * page itself stays a Server Component (no localStorage access here).
 */
import RootRedirect from "@/components/RootRedirect";

export default function HomePage() {
  return <RootRedirect />;
}
