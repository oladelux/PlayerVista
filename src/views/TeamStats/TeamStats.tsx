import { useState } from 'react'

import { BarChart3, Calendar, Info, Shield } from 'lucide-react'
import { useOutletContext, useParams } from 'react-router-dom'

import { Event, Player, PlayerPerformance } from '@/api'
import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEvents } from '@/hooks/useEvents'
import { usePerformance } from '@/hooks/usePerformance'
import { usePlayer } from '@/hooks/usePlayer'
import { combineDateAndTime } from '@/utils/dateObject'
import { aggregatePlayerActions } from '@/utils/phaseMetrics'
import { TeamMatchStats } from '@/views/TeamStats/TeamMatchStats'
import { TeamPerformanceStats } from '@/views/TeamStats/TeamPerformanceStats'

export type TeamType = {
  id: string | undefined
  stats: {
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    cleanSheets: number
    possession: number
    passAccuracy: number
    shotsPerGame: number
    tacklesPerGame: number
  }
  pastMatches?: Event[]
  players?: Player[]
  performanceByTeam?: PlayerPerformance[]
}

export function TeamStats() {
  const { teamId } = useParams()
  const { teams } = useOutletContext<DashboardLayoutOutletContext>()
  const team = teams.find(team => team.id === teamId)
  const { events } = useEvents(teamId, undefined)
  const { performanceByTeam } = usePerformance(undefined, undefined, teamId)
  const { players } = usePlayer(undefined, teamId)
  const pastMatches = events.filter(
    match => new Date(combineDateAndTime(match.date, match.time)) < new Date(),
  )

  const [view, setView] = useState<'overview' | 'matches'>('overview')

  const matchesWon = pastMatches.filter(match => {
    const isHome = match.matchType === 'home'
    if (match.homeScore === undefined || match.awayScore === undefined) return false
    return isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore
  }).length

  const matchesDrawn = pastMatches.filter(match => {
    if (match.homeScore === undefined || match.awayScore === undefined) return false
    return match.homeScore === match.awayScore
  }).length

  const matchesLost = pastMatches.filter(match => {
    const isHome = match.matchType === 'home'
    if (match.homeScore === undefined || match.awayScore === undefined) return false
    return isHome ? match.homeScore < match.awayScore : match.awayScore < match.homeScore
  }).length

  const goalsFor = pastMatches.reduce((acc, match) => {
    const isHome = match.matchType === 'home'
    const score = isHome ? (match.homeScore ?? 0) : (match.awayScore ?? 0)
    return acc + score
  }, 0)

  const goalsAgainst = pastMatches.reduce((acc, match) => {
    const isHome = match.matchType === 'home'
    const score = isHome ? (match.awayScore ?? 0) : (match.homeScore ?? 0)
    return acc + score
  }, 0)

  const cleanSheets = pastMatches.filter(match => {
    const isHome = match.matchType === 'home'
    const opposingScore = isHome ? match.awayScore : match.homeScore
    return opposingScore === 0
  }).length

  // Calculate possession based on actual match data
  // Since direct possession data isn't available, we'll estimate it based on
  // relative strength of teams, goals scored/conceded, and home advantage
  const calculatePossession = () => {
    if (pastMatches.length === 0) return 50 // Default to 50% if no past matches

    // Calculate possession based on a combination of factors:
    // 1. Home advantage (home teams typically have ~55% possession)
    // 2. Goal difference (scoring teams typically have more possession)
    // 3. Match result (winning teams typically have more possession)

    let totalPossession = 0

    pastMatches.forEach(match => {
      const isHome = match.matchType === 'home'
      const homeScore = match.homeScore ?? 0
      const awayScore = match.awayScore ?? 0

      // Base possession starts at 50%
      let matchPossession = 50

      // Home advantage factor: +5% for home, -5% for away
      matchPossession += isHome ? 5 : -5

      // Goal difference factor: each goal difference affects possession by ~3%
      const goalDiff = isHome ? homeScore - awayScore : awayScore - homeScore
      matchPossession += goalDiff * 3

      // Result factor: winners typically have more possession
      if (goalDiff > 0) {
        matchPossession += 3 // Win
      } else if (goalDiff < 0) {
        matchPossession -= 7 // Loss (bigger impact than winning)
      }

      // Ensure possession stays within realistic bounds (35-75%)
      matchPossession = Math.max(35, Math.min(75, matchPossession))

      totalPossession += matchPossession
    })

    // Return average possession across all matches
    return Math.round(totalPossession / pastMatches.length)
  }

  // Calculate pass accuracy based on available data
  const calculatePassAccuracy = () => {
    // If we have performance data, calculate actual pass accuracy
    if (performanceByTeam && performanceByTeam.length > 0) {
      // Aggregate all player actions across the team
      const aggregatedActions = aggregatePlayerActions(performanceByTeam)

      // Calculate pass accuracy based on successful passes / total passes
      const totalPasses =
        aggregatedActions.passes.length +
        aggregatedActions.shortPass.length +
        aggregatedActions.longPass.length

      const successfulPasses =
        aggregatedActions.passes.filter(p => p.successful).length +
        aggregatedActions.shortPass.filter(p => p.successful).length +
        aggregatedActions.longPass.filter(p => p.successful).length

      // Calculate accuracy and convert to percentage
      if (totalPasses > 0) {
        return Math.round((successfulPasses / totalPasses) * 100)
      }
    }

    // Return 0 if no performance data is available
    return 0
  }

  // Calculate shots per game based on available data
  const calculateShotsPerGame = () => {
    // If we have performance data, calculate actual shots per game
    if (performanceByTeam && performanceByTeam.length > 0 && pastMatches.length > 0) {
      // Aggregate all player actions across the team
      const aggregatedActions = aggregatePlayerActions(performanceByTeam)

      // Count total shots
      const totalShots = aggregatedActions.shots.length

      // Calculate shots per game
      return Number((totalShots / pastMatches.length).toFixed(1))
    }

    // Return 0 if no performance data is available
    return 0
  }

  // Calculate tackles per game using actual player data
  const calculateTacklesPerGame = () => {
    // If we have performance data, calculate actual tackles per game
    if (performanceByTeam && performanceByTeam.length > 0 && pastMatches.length > 0) {
      // Aggregate all player actions across the team
      const aggregatedActions = aggregatePlayerActions(performanceByTeam)

      // Count total tackles made by all players
      const totalTackles = aggregatedActions.tackles.length

      // Calculate tackles per game and format to 1 decimal place
      return Number((totalTackles / pastMatches.length).toFixed(1))
    }

    // Return 0 if no performance data is available
    return 0
  }

  const teamData: TeamType = {
    id: teamId,
    stats: {
      played: pastMatches.length,
      won: matchesWon,
      drawn: matchesDrawn,
      lost: matchesLost,
      goalsFor: goalsFor,
      goalsAgainst: goalsAgainst,
      cleanSheets: cleanSheets,
      possession: calculatePossession(),
      passAccuracy: calculatePassAccuracy(),
      shotsPerGame: calculateShotsPerGame(),
      tacklesPerGame: calculateTacklesPerGame(),
    },
    pastMatches,
    players,
    performanceByTeam,
  }

  // Generate real match data from pastMatches instead of using mock data
  const generateMatchesData = () => {
    return pastMatches.map((match, index) => {
      const isHome = match.matchType === 'home'
      const homeScore = match.homeScore ?? 0
      const awayScore = match.awayScore ?? 0
      const goalDiff = isHome ? homeScore - awayScore : awayScore - homeScore

      // Calculate possession for this specific match using the same algorithm
      let possession = 50
      possession += isHome ? 5 : -5
      possession += goalDiff * 3
      if (goalDiff > 0) {
        possession += 3
      } else if (goalDiff < 0) {
        possession -= 7
      }
      possession = Math.max(35, Math.min(75, possession))

      // Find performances for this specific match if available
      const matchPerformances = performanceByTeam?.filter(perf => perf.eventId === match.id) || []

      // Default values for match data (will be overwritten if performance data is available)
      let shots = 0
      let tackles = 0
      let passes = 0

      if (matchPerformances.length > 0) {
        const matchActions = aggregatePlayerActions(matchPerformances)
        // Update with real data
        shots = matchActions.shots.length
        tackles = matchActions.tackles.length
        passes =
          matchActions.passes.length + matchActions.shortPass.length + matchActions.longPass.length
      }

      return {
        id: index + 1,
        opponent: isHome ? match.opponent || 'Unknown' : match.opponent || 'Unknown',
        date: match.date.toString(),
        venue: isHome ? 'Home' : 'Away',
        result:
          goalDiff > 0
            ? `W ${isHome ? homeScore : awayScore}-${isHome ? awayScore : homeScore}`
            : goalDiff < 0
              ? `L ${isHome ? homeScore : awayScore}-${isHome ? awayScore : homeScore}`
              : `D ${homeScore}-${awayScore}`,
        possession: possession,
        shots: shots,
        passes: passes,
        tackles: tackles,
      }
    })
  }

  const matchesData = generateMatchesData()

  return (
    <div className='space-y-6 p-4 md:p-6'>
      {/* Team info card */}
      <Card className='overflow-hidden bg-gradient-to-r from-primary/5 to-primary/10 shadow-md backdrop-blur-sm'>
        <CardContent className='flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start'>
          <Avatar className='size-24 rounded-md border shadow-sm'>
            <img src={team?.logo} alt={team?.teamName} className='aspect-square object-cover' />
          </Avatar>
          <div className='text-center sm:text-left'>
            <h2 className='text-2xl font-bold'>{team?.teamName}</h2>
            <div className='mt-2 flex flex-wrap justify-center gap-2 sm:justify-start'>
              <Badge variant='outline' className='flex items-center gap-1.5 px-2.5 py-0.5'>
                <Info className='size-3.5' />
                <span>Founded: {team?.creationYear}</span>
              </Badge>
              <Badge variant='outline' className='flex items-center gap-1.5 px-2.5 py-0.5'>
                <Shield className='size-3.5' />
                <span>Coach: {team?.headCoach}</span>
              </Badge>
            </div>
            <p className='mt-2 text-sm text-muted-foreground'>
              Stadium: {team?.stadiumName} (0 capacity)
            </p>
          </div>
          <div className='mt-4 flex gap-2 sm:ml-auto sm:mt-0'>
            <Button
              variant={view === 'overview' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setView('overview')}
              className='flex items-center gap-1.5'
            >
              <BarChart3 size={16} />
              Season Overview
            </Button>
            <Button
              variant={view === 'matches' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setView('matches')}
              className='flex items-center gap-1.5'
            >
              <Calendar size={16} />
              Match by Match
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {view === 'overview' ? (
        <div className='space-y-6'>
          <div className='flex items-center space-x-3'>
            <Avatar className='size-10 rounded-md'>
              <img
                src={team?.logo || '/placeholder.svg'}
                alt={`${team?.teamName} logo`}
                className='size-full object-cover'
              />
            </Avatar>
            <div>
              <h2 className='text-xl font-bold'>{team?.teamName || 'Team'}</h2>
              <p className='text-sm text-muted-foreground'>Team Statistics</p>
            </div>
          </div>
          <TeamPerformanceStats teamData={{ ...teamData, performanceByTeam }} />
        </div>
      ) : (
        <TeamMatchStats teamData={teamData} matchesData={matchesData} />
      )}
    </div>
  )
}
