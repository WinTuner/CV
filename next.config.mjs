import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production builds must never write into `.next`, which `next dev` uses
  // as its live cache. Sharing the directory corrupts dev chunks (ChunkLoadError).
  distDir: process.env.NODE_ENV === 'production' ? '.next-build' : '.next',
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withAnalyzer(nextConfig)
