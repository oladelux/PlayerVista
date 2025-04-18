import { useLocation } from 'react-router-dom'

// Define the parent-child page relationships
const hierarchicalRoutes: Record<string, string> = {
  // Player-related routes
  '/player-statistics': '/players',
  '/manage-player': '/players',
  '/add-player': '/players',

  // Team-related routes
  '/manage-team': '/manage-teams',
  '/add-team': '/manage-teams',
  '/team-stats': '/manage-teams',

  // Event-related routes
  '/event-statistics': '/events',
  '/manage-event': '/events',
  '/add-event': '/events',

  // Staff-related routes
  '/manage-staff': '/staffs',
  '/add-staff': '/staffs',
}

// Define patterns for routes with entity IDs
const idPatterns = [
  // Format: [regex pattern, parent route]
  { pattern: /^\/([^/]+)\/manage-team$/, parent: '/manage-teams' },
  { pattern: /^\/([^/]+)\/players$/, parent: '/manage-teams' },
  { pattern: /^\/([^/]+)\/team-stats$/, parent: '/manage-teams' },
  { pattern: /^\/team\/([^/]+)$/, parent: '/manage-teams' },
]

export function useBackLink(): string | undefined {
  const location = useLocation()
  const path = location.pathname

  // Return undefined for root paths
  if (
    path === '/' ||
    path === '/dashboard' ||
    path === '/players' ||
    path === '/manage-teams' ||
    path === '/events' ||
    path === '/staffs' ||
    path === '/settings' ||
    path === '/activity'
  ) {
    return undefined
  }

  // Handle routes with entity IDs using the patterns we defined
  for (const { pattern, parent } of idPatterns) {
    if (pattern.test(path)) {
      return parent
    }
  }

  // Find the parent path based on the current path
  for (const [childPathPrefix, parentPath] of Object.entries(hierarchicalRoutes)) {
    if (path.startsWith(childPathPrefix)) {
      return parentPath
    }
  }

  // Extract the parent path for dynamic routes with IDs
  // For routes like /player-statistics/123, extract /players
  const segments = path.split('/')
  if (segments.length >= 3 && segments[1] && segments[2]) {
    const pathWithoutId = '/' + segments[1]
    // Check if this is a known child path with ID
    for (const [childPathPrefix, parentPath] of Object.entries(hierarchicalRoutes)) {
      if (pathWithoutId === childPathPrefix) {
        return parentPath
      }
    }
  }

  // Default fallback - go to the parent directory in URL
  const pathParts = path.split('/').filter(Boolean)
  if (pathParts.length > 0) {
    // Remove the last part (current page) to get parent
    pathParts.pop()
    return pathParts.length > 0 ? '/' + pathParts.join('/') : '/'
  }

  // If no parent can be determined, go to root
  return '/'
}
