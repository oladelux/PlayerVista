import { useLocation } from 'react-router-dom'

export function useBackLink(): string | undefined {
  const location = useLocation()

  // Return undefined for dashboard route
  if (location.pathname === '/dashboard') {
    return undefined
  }

  // Try to get previous path from the history state if available
  const previousPath = location.state?.from
  if (previousPath && previousPath !== location.pathname) {
    return previousPath
  }

  // Use document.referrer as a fallback
  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer)
      // Only use referrer if it's from the same origin
      if (referrerUrl.origin === window.location.origin) {
        const referrerPath = referrerUrl.pathname
        if (referrerPath && referrerPath !== location.pathname) {
          return referrerPath
        }
      }
    } catch {
      // Invalid referrer URL
      return undefined
    }
  }

  // Default fallback for most routes
  return '/'
}
