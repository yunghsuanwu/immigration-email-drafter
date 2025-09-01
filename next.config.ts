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
  // ... any other existing config options
}

export default nextConfig
