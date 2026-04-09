import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // CMS is always server-rendered — no static pre-rendering needed
  // (all pages require auth + live Supabase data)
  experimental: {
    ppr: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
