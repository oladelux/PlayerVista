import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCcw } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import DownloadPdfButton from '@/component/DownloadPdfButton/DownloadPdfButton.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import PlayerDataTab from '@/component/PlayerDataTab/PlayerDataTab.tsx'
import ProfileTeamImage from '@/component/ProfileTeamImage/ProfileTeamImage.tsx'
import DatePickerField from '@/components/form/DatePickerField.tsx'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import { Form } from '@/components/ui/form.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { PdfType } from '@/config/PdfType.ts'
import { useEvents } from '@/hooks/useEvents.ts'
import { usePerformance } from '@/hooks/usePerformance.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { useTeam } from '@/hooks/useTeam.ts'
import { calculateAge } from '@/services/helper.ts'
import {
  aggregatePlayerActions,
  DefensiveMetrics,
  DisciplineMetric,
  GoalkeepingMetrics,
  OffensiveMetrics,
  PossessionMetrics,
} from '@/utils/phaseMetrics.ts'
import {
  getDefensiveChartData,
  getDefensiveData,
  getDisciplinaryChartData,
  getDisciplinaryData,
  getGoalkeeperChartData,
  getGoalkeeperData,
  getOffensiveChartData,
  getOffensiveData,
  getPossessionChartData,
  getPossessionData,
} from '@/utils/players.ts'

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

export default function PlayerStats() {
  const { playerId, teamId } = useParams()
  const { player } = usePlayer(playerId, teamId)
  const { team } = useTeam(teamId)
  const { events } = useEvents(teamId, undefined)
  const { performanceByPlayer, loading, error } = usePerformance(playerId, undefined)

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

  if(!player || team === null) {
    return null
  }

  const dateRange = form.watch('dateRange') as DateRange
  const year = form.watch('year')
  const hasFilters = !!year || !!(dateRange?.from || dateRange?.to)

  const filteredData = performanceByPlayer.filter((performance) => {
    const event = events.find((event) => event.id === performance.eventId)
    if (!event) return false // Exclude if no matching event

    const eventStartDate = new Date(event.startDate)

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
  const totalMinutesPlayed = filteredData.reduce((sum, match) => {
    return sum + (match.minutePlayed || 0)
  }, 0)
  const numberOfMatchesPlayed = filteredData.filter(match => match.minutePlayed !== null).length

  // Sort filtered data by event start date
  const sortedPlayerDataForPDF = filteredData.sort((a, b) => {
    const eventA = events.find((event) => event.id === a.eventId)
    const eventB = events.find((event) => event.id === b.eventId)
    if (!eventA || !eventB) return 0
    return new Date(eventA.startDate).getTime() - new Date(eventB.startDate).getTime()
  })

  const aggregatePlayerData = aggregatePlayerActions(filteredData)

  const offensiveData = getOffensiveData(aggregatePlayerData)
  const defensiveData = getDefensiveData(aggregatePlayerData)
  const possessionData = getPossessionData(aggregatePlayerData)
  const disciplinaryData = getDisciplinaryData(aggregatePlayerData)
  const goalkeeperData = getGoalkeeperData(aggregatePlayerData)

  const offensiveChartData = getOffensiveChartData(sortedPlayerDataForPDF)
  const defensiveChartData = getDefensiveChartData(sortedPlayerDataForPDF)
  const possessionChartData = getPossessionChartData(sortedPlayerDataForPDF)
  const disciplinaryChartData = getDisciplinaryChartData(sortedPlayerDataForPDF)
  const goalkeeperChartData = getGoalkeeperChartData(sortedPlayerDataForPDF)

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error) {
    return 'This is an error page'
  }

  return (
    <DashboardLayout>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className='flex items-center justify-between'>
          <Form {...form}>
            <form>
              <div className='grid grid-cols-4 gap-2 sm:grid-cols-1 md:grid-cols-2'>
                <div className='col-span-1' >
                  <div className='text-xs text-sub-text'>Filter by Year</div>
                  <SelectFormField
                    control={form.control}
                    name='year'
                    options={yearSelect}
                    inputClassName='w-48 h-10'
                  />
                </div>
                <div className='col-span-1' >
                  <div className='text-xs text-sub-text'>Filter by Date Range</div>
                  <DatePickerField control={form.control} name='dateRange' />
                </div>
              </div>
            </form>
          </Form>
          <div className='text-center'>
            {hasFilters && (<><div className='text-xs text-sub-text'>Reset Filter</div>
              <RotateCcw className='w-24 cursor-pointer' onClick={() => form.reset()}/>
            </>)}
          </div>
          <DownloadPdfButton
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
          />
        </div>
      </div>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className='mb-5 text-sub-text'>Player Stats</div>
        <div className='flex items-center justify-between border-b border-border-line pb-5'>
          <ProfileTeamImage playerId={playerId} teamId={teamId}/>
        </div>
        <div className='mt-5 grid grid-cols-3 gap-10'>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>AGE</div>
            <div className='text-xs'>{calculateAge(player.birthDate)}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>POSITION</div>
            <div className='text-xs'>{player.position}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>JERSEY NUMBER</div>
            <div className='text-xs'>{player.uniformNumber}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>TOTAL MINUTES PLAYED</div>
            <div className='text-xs'>{totalMinutesPlayed}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>TOTAL MATCHES PLAYED</div>
            <div className='text-xs'>{numberOfMatchesPlayed}</div>
          </div>
        </div>
      </div>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className='my-5'>
          <Tabs defaultValue='offensive'>
            <TabsList className='mb-5 contents gap-3 bg-transparent p-0 md:grid md:grid-cols-5'>
              <TabsTrigger
                value='offensive'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'>Offensive</TabsTrigger>
              <TabsTrigger
                value='defensive'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                  Defensive
              </TabsTrigger>
              <TabsTrigger
                value='possession'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                  Possession
              </TabsTrigger>
              <TabsTrigger
                value='disciplinary'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                  Disciplinary
              </TabsTrigger>
              <TabsTrigger
                value='goalkeeping'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                  Goalkeeping
              </TabsTrigger>
            </TabsList>
            <TabsContent value='offensive' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={OffensiveMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='defensive' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={DefensiveMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='possession' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={PossessionMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='disciplinary' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={DisciplineMetric} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='goalkeeping' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={GoalkeepingMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
