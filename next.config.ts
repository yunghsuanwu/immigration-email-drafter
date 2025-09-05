import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://email-drafter.notastranger.org/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 're-immigration.notastranger.org',
          },
        ],
      },
    ]
  },
  
  // Security configurations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable compression
  
  // Additional security measures
  generateEtags: false, // Remove ETags that might reveal server info
  trailingSlash: false, // Consistent URL structure
  
  // Additional security headers via headers()
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
        ],
      },
    ]
  },
}

export default nextConfig
