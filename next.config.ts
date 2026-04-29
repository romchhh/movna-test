import type { NextConfig } from 'next';

/** На VPS з 1 GB RAM: `SKIP_BUILD_TYPECHECK=1 next build --webpack` (див. package.json). */
const skipTypecheck = process.env.SKIP_BUILD_TYPECHECK === '1';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: skipTypecheck,
  },
  /** Менше паралельних воркерів при static generation — нижче пікове споживання RAM */
  experimental: {
    cpus: Math.max(1, parseInt(process.env.NEXT_BUILD_CPUS || '1', 10) || 1),
    workerThreads: false,
  },
  /** Для `next build --webpack`: обмежити паралельність компіляції модулів */
  webpack: (config) => {
    const p = Math.max(1, parseInt(process.env.WEBPACK_PARALLELISM || '1', 10) || 1);
    config.parallelism = p;
    return config;
  },
};

export default nextConfig;
