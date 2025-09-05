import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'

export function middleware(request: NextRequest) {
  // Generate nonce for this request
  const nonce = randomBytes(16).toString('base64')
  
  // Create response
  const response = NextResponse.next()
  
  // Add nonce to response headers for use in components
  response.headers.set('x-nonce', nonce)

  // Security Headers
  const securityHeaders = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Control referrer information
    'Referrer-Policy': 'no-referrer',
    
    // Remove server information
    'X-Powered-By': '',
    'Server': '',
    
    // Content Security Policy with nonces
    'Content-Security-Policy': [
      "default-src 'self'",
      // Use nonces instead of unsafe-inline for better security
      ...(process.env.NODE_ENV === 'development' 
        ? [`script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://vercel.live`] // Development: Allow Vercel live preview
        : [`script-src 'self' 'nonce-${nonce}' https://vercel.live`] // Production: Remove unsafe-eval
      ),
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.openai.com https://*.supabase.co https://members-api.parliament.uk",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "media-src 'self'"
    ].join('; '),
    
    // Additional security headers
    'X-DNS-Prefetch-Control': 'off',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value)
    } else {
      response.headers.delete(key)
    }
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
