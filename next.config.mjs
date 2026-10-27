import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Build optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vector-web.storage.pro-data.tech",
      },
      { protocol: "https", hostname: "vector-taxi.uz" },
      { protocol: "https", hostname: "www.vector-taxi.uz" },
    ],
    // Optimize image processing
    formats: ['image/webp'],
  },
  // TypeScript optimizations
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  // Font optimization
  optimizeFonts: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
    ],
  },
};

export default withNextIntl(nextConfig);
