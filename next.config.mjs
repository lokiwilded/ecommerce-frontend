/* @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true, // Enforce React's strict mode for highlighting potential problems
  swcMinify: true, // Use SWC for faster builds and optimized output

  images: {
    domains: ['example.com', 'cdn.example.com'], // Allow domains for optimized images
  },

  i18n: {
    locales: ['en', 'es', 'fr'], // Supported locales
    defaultLocale: 'en', // Default locale
  },

  experimental: {
    appDir: true, // Enable Next.js 13 app directory features
  },

  webpack(config, { isServer }) {
    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Disable 'fs' module for client-side builds
        net: false,
        tls: false,
      };
    }

    // Add custom plugins or modify config as needed

    return config; // Return the updated Webpack configuration
  },

  async headers() {
    return [
      {
        source: '/(.*)', // Apply headers to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*', // Proxy to backend
      },
    ];
  },
});

export default nextConfig;
