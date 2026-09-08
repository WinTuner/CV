import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel's Next.js adapter reads the build output from `.next`, so the
  // stock directory must stay in use there. Everywhere else, production
  // builds go to `.next-build` so they can never corrupt the `.next`
  // directory a running `next dev` uses as its live cache (ChunkLoadError).
  distDir: process.env.VERCEL === '1' ? '.next' : process.env.NODE_ENV === 'production' ? '.next-build' : '.next',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Trim icon/radix barrels — up to ~80KB saved on first-load JS
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
    ],
  },
  compiler: {
    // Drop console.* in production (keep error/warn)
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Smaller deviceSizes + imageSizes cut srcSet bloat
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Cache static assets aggressively; keep HTML dynamic
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|css|js|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withAnalyzer(nextConfig)
