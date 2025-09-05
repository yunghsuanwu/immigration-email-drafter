import { headers } from 'next/headers'

/**
 * Get the nonce from request headers for CSP
 * This allows components to use the nonce for inline scripts/styles
 */
export async function getNonce(): Promise<string> {
  const headersList = await headers()
  return headersList.get('x-nonce') || ''
}
