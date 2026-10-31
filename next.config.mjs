import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
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
    formats: ['image/avif', 'image/webp'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  optimizeFonts: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-slot',
    ],
  },
};

export default withNextIntl(nextConfig);
