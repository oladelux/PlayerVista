import { useLocation } from 'react-router-dom'

type TitleDescription = {
  title: string
  description: string
}

type RoutePattern = {
  pattern: RegExp
  metadata: TitleDescription
}

export function usePageMetadata(): TitleDescription {
  const { pathname } = useLocation()

  // Function to get metadata based on route patterns
  return getMetadataForPath(pathname)
}

/**
 * Gets title and description metadata for any route in the application
 */
export function getMetadataForPath(pathname: string): TitleDescription {
  // 1. Exact route matches (highest priority)
  const exactRoutes: Record<string, TitleDescription> = {
    '/dashboard': {
      title: 'Dashboard',
      description: 'Welcome back to your team management dashboard',
    },
    '/manage-teams': {
      title: 'Teams',
      description: 'Manage your teams',
    },
    '/players': {
      title: 'Players',
      description: 'Manage your players',
    },
    '/players/add-player': {
      title: 'Add Player',
      description: 'Add a new player to your team',
    },
    '/settings': {
      title: 'Settings',
      description: 'Manage your settings',
    },
    '/staffs': {
      title: 'Staffs',
      description: 'Manage your staffs',
    },
    '/team-stats': {
      title: 'Team Stats',
      description: 'Detailed team performance analysis ',
    },
    '/events': {
      title: 'Calendar',
      description: 'Manage your calender',
    },
  }

  // Check for exact match first
  if (exactRoutes[pathname]) {
    return exactRoutes[pathname]
  }

  // 2. Pattern-based routes (for dynamic segments)
  const patternRoutes: RoutePattern[] = [
    // Specific entity with ID
    {
      pattern: /^\/player-statistics\/([0-9a-f-]+)$/,
      metadata: {
        title: 'Player Statistics',
        description: 'Detailed performance analysis for this player',
      },
    },
    {
      pattern: /^\/team-stats\/([0-9a-f-]+)$/,
      metadata: {
        title: 'Team Statistics',
        description: 'Detailed performance analysis for this team',
      },
    },
    {
      pattern: /^\/player\/([0-9a-f-]+)$/,
      metadata: {
        title: 'Player Profile',
        description: 'View and manage player details',
      },
    },
    {
      pattern: /^\/team\/([0-9a-f-]+)$/,
      metadata: {
        title: 'Team Profile',
        description: 'View and manage team details',
      },
    },
    {
      pattern: /^\/manage-player\/([0-9a-f-]+)$/,
      metadata: {
        title: 'Manage Player',
        description: 'Manage player details',
      },
    },

    // Catch-all patterns for sections (lowest priority patterns)
    {
      pattern: /^\/player-statistics\/.+$/,
      metadata: {
        title: 'Player Statistics',
        description: 'Player performance analysis',
      },
    },
    {
      pattern: /^\/team-stats\/.+$/,
      metadata: {
        title: 'Team Statistics',
        description: 'Team performance analysis',
      },
    },
  ]

  // Check each pattern in order (first match wins)
  for (const route of patternRoutes) {
    if (route.pattern.test(pathname)) {
      return route.metadata
    }
  }

  // 3. Default fallback for unknown routes
  return {
    title: 'Team Management',
    description: 'Manage your sports team',
  }
}
