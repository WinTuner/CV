import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel's Next.js adapter reads the build output from `.next`, so the
  // stock directory must stay in use there. Everywhere else, production
  // builds go to `.next-build` so they can never corrupt the `.next`
  // directory a running `next dev` uses as its live cache (ChunkLoadError).
  distDir: process.env.VERCEL === '1' ? '.next' : process.env.NODE_ENV === 'production' ? '.next-build' : '.next',
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
