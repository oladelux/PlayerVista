import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { BarChart3, Calendar, RotateCcw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useOutletContext, useParams } from 'react-router-dom'
import { z } from 'zod'

import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage'
import PlayerDataTab from '@/component/PlayerDataTab/PlayerDataTab'
import DatePickerField from '@/components/form/DatePickerField'
import SelectFormField from '@/components/form/SelectFormField'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExportPdfButton } from '@/components/ui/export-pdf-button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEvents } from '@/hooks/useEvents'
import { usePerformance } from '@/hooks/usePerformance'
import { usePlayer } from '@/hooks/usePlayer'
import { calculateAge } from '@/services/helper'
import { combineDateAndTime } from '@/utils/dateObject'
import { createPlayerSeasonPdfOptions } from '@/utils/exportPlayerPdf'
import {
  aggregatePlayerActions,
  DefensiveMetrics,
  DisciplineMetric,
  GoalkeepingMetrics,
  OffensiveMetrics,
  PossessionMetrics,
} from '@/utils/phaseMetrics'
import { getPlayerMatches, getPlayerPerformanceData } from '@/utils/players'
import { SessionInstance } from '@/utils/SessionInstance'

import { PlayerMatchStats } from './PlayerMatchStats'
import { PlayerPerformanceChart } from './PlayerPerformanceChart'

// Schema for the filter form
const playerStatsSchema = z.object({
  year: z.string(),
  dateRange: z.object({
    from: z.date().nullable(),
    to: z.date().nullable(),
  }),
})

const currentYear = new Date().getFullYear()
const yearSelect = [
  { label: 'All', value: 'All' },
  ...Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i
    return { label: year.toString(), value: year.toString() }
  }),
]

type playerStatsSchemaIn = Partial<z.input<typeof playerStatsSchema>>
type playerStatsSchemaOut = z.output<typeof playerStatsSchema>

export function PlayerStats() {
  const { playerId } = useParams()
  const teamId = SessionInstance.getTeamId()
  const [view, setView] = useState<'overview' | 'matches'>('overview')

  // Get data from hooks
  const { teams } = useOutletContext<DashboardLayoutOutletContext>()
  const { player } = usePlayer(playerId, teamId)
  const team = teams.find(team => team.id === teamId)
  const { events } = useEvents(teamId, undefined)
  const { performanceByPlayer, loading, error } = usePerformance(playerId, undefined, undefined)
  const playerEvents = performanceByPlayer.map(performance => {
    const event = events.find(event => event.id === performance.eventId)
    return {
      ...performance,
      eventDate: event?.date,
      opponent: event?.opponent,
    }
  })
  const playerPerformanceData = getPlayerPerformanceData(playerEvents, player?.position)
  const playerMatches = getPlayerMatches(playerEvents, player?.position)

  // Setup form for filters
  const defaultValues: playerStatsSchemaIn = {
    year: '',
    dateRange: {
      from: null,
      to: null,
    },
  }

  const form = useForm<playerStatsSchemaIn, never, playerStatsSchemaOut>({
    resolver: zodResolver(playerStatsSchema),
    defaultValues,
  })

  if (loading) return <LoadingPage />
  if (error || !player || !team) return <div>This is an error pages</div>

  const dateRange = form.watch('dateRange')
  const year = form.watch('year')
  const hasFilters = !!year || !!(dateRange?.from || dateRange?.to)

  // Create PDF options for the player using the helper function
  const playerFullName = `${player.firstName} ${player.lastName}`
  const pdfOptions = createPlayerSeasonPdfOptions(playerId || '', playerFullName, team.teamName)

  // Filter performance data based on selected filters
  const filteredData = performanceByPlayer.filter(performance => {
    const event = events.find(event => event.id === performance.eventId)
    if (!event) return false

    const eventStartDate = new Date(combineDateAndTime(event?.date, event?.time))

    // Filter by year if a specific year is selected
    if (year && year !== 'All') {
      const selectedYear = parseInt(year, 10)
      if (eventStartDate.getFullYear() !== selectedYear) {
        return false
      }
    }

    // Filter by date range if provided
    if (dateRange?.from || dateRange?.to) {
      const fromDate = dateRange?.from ? new Date(dateRange.from) : null
      const toDate = dateRange?.to ? new Date(dateRange.to) : null

      if (fromDate && eventStartDate < fromDate) {
        return false
      }
      if (toDate && eventStartDate > toDate) {
        return false
      }
    }

    return true
  })

  // Calculate stats from filtered data
  const totalMinutesPlayed = filteredData.reduce((sum, match) => {
    return sum + (match.minutePlayed || 0)
  }, 0)

  const numberOfMatchesPlayed = filteredData.filter(match => match.minutePlayed !== null).length

  // Aggregate player data for stats
  const aggregatePlayerData = aggregatePlayerActions(filteredData)

  // Generate player initials for avatar
  const playerInitials = `${player.firstName?.charAt(0) || ''}${player.lastName?.charAt(0) || ''}`

  return (
    <>
      <ExportPdfButton
        options={pdfOptions}
        variant='default'
        style={{ backgroundColor: 'rgb(36, 0, 38)' }}
        className='flex items-center gap-1.5'
        customLabel='Export Full Report'
      />
      <div className='animate-fade-in space-y-6 p-4 md:p-6'>
        <Card className='overflow-hidden bg-gradient-to-r from-[rgb(36,0,38)] to-[rgb(80,20,83)] text-white'>
          <CardContent className='relative p-6'>
            <div className='relative z-10 flex flex-col gap-6 md:flex-row md:items-center'>
              <div className='flex items-center gap-4'>
                <Avatar className='size-24 border-2 border-white/30'>
                  <AvatarFallback className='bg-white/10 text-3xl text-white'>
                    {playerInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='flex items-center gap-2 text-3xl font-bold'>
                    {player.firstName} {player.lastName}
                    <Badge className='ml-2 bg-white/20 text-white hover:bg-white/30'>
                      {player.uniformNumber}
                    </Badge>
                  </h2>
                  <div className='mt-1 flex items-center gap-2'>
                    <Badge variant='outline' className='border-white/30 text-white'>
                      {player.position}
                    </Badge>
                    <span className='text-sm text-white/70'>{team.teamName}</span>
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <Badge className='bg-white/20 text-white hover:bg-white/30'>
                      Matches: {numberOfMatchesPlayed}
                    </Badge>
                    <Badge className='bg-white/20 text-white hover:bg-white/30'>
                      Minutes: {totalMinutesPlayed}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='mt-4 grid flex-1 grid-cols-2 gap-4 text-white sm:grid-cols-3 md:mt-0 md:grid-cols-5'>
                <div className='space-y-1'>
                  <p className='text-sm text-white/70'>Age</p>
                  <p className='font-medium'>{calculateAge(player.birthDate)}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-white/70'>Nationality</p>
                  <p className='font-medium'>{player.nationality}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-white/70'>Height</p>
                  <p className='font-medium'>{player.height}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-white/70'>Weight</p>
                  <p className='font-medium'>{player.weight}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm text-white/70'>Preferred Foot</p>
                  <p className='font-medium'>{player.preferredFoot}</p>
                </div>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className='absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/5'></div>
            <div className='absolute bottom-0 left-0 size-48 -translate-x-1/4 translate-y-1/2 rounded-full bg-white/5'></div>
          </CardContent>
        </Card>
        {/* Filters Card */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <Form {...form}>
                <form className='w-full'>
                  <div className='flex gap-4'>
                    <div>
                      <div className='mb-1 text-xs text-muted-foreground'>Filter by Year</div>
                      <SelectFormField
                        control={form.control}
                        name='year'
                        options={yearSelect}
                        inputClassName='w-fit'
                      />
                    </div>
                    <div>
                      <div className='mb-1 text-xs text-muted-foreground'>Filter by Date Range</div>
                      <DatePickerField control={form.control} name='dateRange' />
                    </div>
                  </div>
                </form>
              </Form>

              {hasFilters && (
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1.5'
                  onClick={() => form.reset()}
                >
                  <RotateCcw size={14} />
                  Reset Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats View Toggle */}
        <div className='flex justify-between gap-2'>
          <div className='flex space-x-2'>
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
          {/* <DownloadPdfButton
            templateName='fullPlayerReport'
            filename={`${player.lastName}_${player.firstName}`}
            pdfType={PdfType.FULL_PLAYER_REPORT}
            data={{
              player,
              team,
              totalMatchesPlayed: numberOfMatchesPlayed,
              totalMinutesPlayed,
              calculatedAge: calculateAge(player.birthDate),
              offensiveData,
              defensiveData,
              possessionData,
              disciplinaryData,
              goalkeeperData,
              offensiveChartData: JSON.stringify(offensiveChartData),
              defensiveChartData: JSON.stringify(defensiveChartData),
              possessionChartData: JSON.stringify(possessionChartData),
              disciplinaryChartData: JSON.stringify(disciplinaryChartData),
              goalkeeperChartData: JSON.stringify(goalkeeperChartData),
            }}
          /> */}
        </div>

        {/* Main Content */}
        {view === 'overview' && (
          // Performance Tabs
          <Card>
            <CardContent className='p-6'>
              <Tabs defaultValue='offensive'>
                <TabsList className='mb-5 grid grid-cols-5 gap-2'>
                  <TabsTrigger value='offensive'>Offensive</TabsTrigger>
                  <TabsTrigger value='defensive'>Defensive</TabsTrigger>
                  <TabsTrigger value='possession'>Possession</TabsTrigger>
                  <TabsTrigger value='disciplinary'>Disciplinary</TabsTrigger>
                  <TabsTrigger value='goalkeeping'>Goalkeeping</TabsTrigger>
                </TabsList>
                <TabsContent value='offensive' className='animate-fade-in rounded-lg border p-6'>
                  <PlayerDataTab metrics={OffensiveMetrics} actions={aggregatePlayerData} />
                </TabsContent>
                <TabsContent value='defensive' className='animate-fade-in rounded-lg border p-6'>
                  <PlayerDataTab metrics={DefensiveMetrics} actions={aggregatePlayerData} />
                </TabsContent>
                <TabsContent value='possession' className='animate-fade-in rounded-lg border p-6'>
                  <PlayerDataTab metrics={PossessionMetrics} actions={aggregatePlayerData} />
                </TabsContent>
                <TabsContent value='disciplinary' className='animate-fade-in rounded-lg border p-6'>
                  <PlayerDataTab metrics={DisciplineMetric} actions={aggregatePlayerData} />
                </TabsContent>
                <TabsContent value='goalkeeping' className='animate-fade-in rounded-lg border p-6'>
                  <PlayerDataTab metrics={GoalkeepingMetrics} actions={aggregatePlayerData} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {view === 'matches' && <PlayerMatchStats playerData={player} matchesData={playerMatches} />}

        {/* Performance Over Time */}
        {view === 'overview' && <PlayerPerformanceChart performanceData={playerPerformanceData} />}
      </div>
    </>
  )
}
