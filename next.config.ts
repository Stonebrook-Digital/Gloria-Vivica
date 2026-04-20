import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /** Avoids dev overlay / indicator edge cases with webpack + RSC. */
  devIndicators: false,
  experimental: {
    /** Default `true` in Next 15 can trigger “SegmentViewNode … Client Manifest” dev bugs. */
    devtoolSegmentExplorer: false,
  },
  /**
   * Dev-only: webpack persistent cache can desync with HMR and surface
   * `__webpack_modules__[moduleId] is not a function` (blank page if the client chunk fails).
   * Avoid `experimental.optimizePackageImports` for `motion` here—it has triggered that
   * runtime error with this stack. Production keeps default webpack caching.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
}

export default nextConfig
