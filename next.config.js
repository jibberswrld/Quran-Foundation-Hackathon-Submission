/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Vercel build injects these into the compiler output (helps Edge + client).
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
};

module.exports = nextConfig;
