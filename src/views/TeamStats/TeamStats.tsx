import { useState } from 'react'

import { BarChart3, Calendar, Info, Shield } from 'lucide-react'
import { useOutletContext, useParams } from 'react-router-dom'

import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEvents } from '@/hooks/useEvents'
import { TeamMatchStats } from '@/views/TeamStats/TeamMatchStats'
import { TeamPerformanceStats } from '@/views/TeamStats/TeamPerformanceStats'

export function TeamStats() {
  const { teamId } = useParams()
  const { teams } = useOutletContext<DashboardLayoutOutletContext>()
  const team = teams.find(team => team.id === teamId)
  const { events } = useEvents(teamId, undefined)
  const pastMatches = events.filter(match => new Date(match.endDate) < new Date())

  const [view, setView] = useState<'overview' | 'matches'>('overview')
  const matchesWon = pastMatches.filter(match => {
    const isHome = match.eventLocation === 'home'
    return isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore
  }).length
  const matchesDrawn = pastMatches.filter(match => {
    const isHome = match.eventLocation === 'home'
    return isHome ? match.homeScore === match.awayScore : match.awayScore === match.homeScore
  }).length
  const matchesLost = pastMatches.filter(match => {
    const isHome = match.eventLocation === 'home'
    return isHome ? match.homeScore < match.awayScore : match.awayScore < match.homeScore
  }).length
  const goalsFor = pastMatches.reduce((acc, match) => {
    const isHome = match.eventLocation === 'home'
    return isHome ? acc + match.homeScore : acc + match.awayScore
  }, 0)
  const goalsAgainst = pastMatches.reduce((acc, match) => {
    const isHome = match.eventLocation === 'home'
    return isHome ? acc + match.awayScore : acc + match.homeScore
  }, 0)
  const cleanSheets = pastMatches.filter(match => {
    const isHome = match.eventLocation === 'home'
    return isHome ? match.homeScore === 0 : match.awayScore === 0
  }).length

  const teamData = {
    id: teamId,
    stats: {
      played: pastMatches.length,
      won: matchesWon,
      drawn: matchesDrawn,
      lost: matchesLost,
      goalsFor: goalsFor,
      goalsAgainst: goalsAgainst,
      cleanSheets: cleanSheets,
      possession: 54,
      passAccuracy: 83,
      shotsPerGame: 14.2,
      tacklesPerGame: 18.6,
    },
  }

  // Mock data for matches
  const matchesData = [
    {
      id: 1,
      opponent: 'Arsenal',
      date: '2023-08-12',
      venue: 'Home',
      result: 'W 2-1',
      possession: 51,
      shots: 14,
      passes: 423,
      tackles: 16,
    },
    {
      id: 2,
      opponent: 'Liverpool',
      date: '2023-08-19',
      venue: 'Away',
      result: 'D 1-1',
      possession: 46,
      shots: 10,
      passes: 378,
      tackles: 20,
    },
    {
      id: 3,
      opponent: 'Newcastle',
      date: '2023-08-26',
      venue: 'Home',
      result: 'W 3-0',
      possession: 62,
      shots: 18,
      passes: 578,
      tackles: 14,
    },
    {
      id: 4,
      opponent: 'Chelsea',
      date: '2023-09-02',
      venue: 'Away',
      result: 'L 0-2',
      possession: 48,
      shots: 8,
      passes: 402,
      tackles: 19,
    },
    {
      id: 5,
      opponent: 'Everton',
      date: '2023-09-16',
      venue: 'Home',
      result: 'W 2-0',
      possession: 58,
      shots: 16,
      passes: 504,
      tackles: 12,
    },
  ]

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
        <TeamPerformanceStats teamData={teamData} />
      ) : (
        <TeamMatchStats teamData={teamData} matchesData={matchesData} />
      )}
    </div>
  )
}
