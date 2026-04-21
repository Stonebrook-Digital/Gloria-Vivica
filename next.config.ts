import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /** Avoids dev overlay / indicator edge cases with webpack + RSC. */
  devIndicators: false,
  experimental: {
    /** Default `true` in Next 15 can trigger “SegmentViewNode … Client Manifest” dev bugs. */
    devtoolSegmentExplorer: false,
  },
  /**
   * Use with `npm run dev:turbo`. Keeps Next from warning when `webpack()` is also defined.
   * Default `npm run dev` uses Webpack—Turbopack can race on `_buildManifest.js.tmp` on refresh (ENOENT).
   */
  turbopack: {},
  /**
   * Webpack-only (e.g. `next dev` without `--turbo`, or `next build`):
   * - Disable persistent cache in dev: HMR can desync and cause
   *   `__webpack_modules__[moduleId] is not a function` / blank page.
   * - Turn off scope concatenation in dev: rare but known to mismatch chunk module maps with HMR.
   * Avoid `experimental.optimizePackageImports` for animation libs—it can trigger the same runtime error.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
      if (config.optimization) {
        config.optimization.concatenateModules = false
      }
    }
    return config
  },
}

export default nextConfig
