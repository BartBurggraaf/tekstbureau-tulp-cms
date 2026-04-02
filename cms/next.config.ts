import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // CMS is always server-rendered — no static pre-rendering needed
  // (all pages require auth + live Supabase data)
  experimental: {
    ppr: false,
  },
}

export default nextConfig
