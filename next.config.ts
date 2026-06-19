import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io'        },
      { protocol: 'https', hostname: 'res.cloudinary.com'   },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',        value: 'DENY'                            },
        { key: 'X-Content-Type-Options', value: 'nosniff'                         },
        { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
      ],
    }]
  },
  compress:        true,
  poweredByHeader: false,
}

export default nextConfig
