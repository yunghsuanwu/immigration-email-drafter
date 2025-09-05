import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

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
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      // Use environment-based CSP for better security
      ...(process.env.NODE_ENV === 'development' 
        ? ["script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live"] // Development: Allow Vercel live preview
        : ["script-src 'self' 'unsafe-inline' https://vercel.live"] // Production: Remove unsafe-eval
      ),
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.openai.com https://*.supabase.co https://members-api.parliament.uk", // Added Parliament API
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    
    // Additional security headers
    'X-DNS-Prefetch-Control': 'off',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
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
