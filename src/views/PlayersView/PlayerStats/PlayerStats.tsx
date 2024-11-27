import { useParams } from 'react-router-dom'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/types.ts'
import { getPerformancesForPlayerThunk, playerPerformanceSelector } from '@/store/slices/PlayerPerformanceSlice.ts'
import { useSelector } from 'react-redux'
import ProfileTeamImage from '@/component/ProfileTeamImage/ProfileTeamImage.tsx'
import { calculateAge } from '@/services/helper.ts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import PlayerDataTab from '@/component/PlayerDataTab/PlayerDataTab.tsx'
import {
  aggregatePlayerActions,
  DefensiveMetrics,
  DisciplineMetric,
  GoalkeepingMetrics,
  OffensiveMetrics,
  PossessionMetrics,
} from '@/utils/phaseMetrics.ts'
import { Form } from '@/components/ui/form.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import SelectFormField from '@/components/form/SelectFormField.tsx'
import DatePickerField from '@/components/form/DatePickerField.tsx'
import { DateRange } from 'react-day-picker'
import { useTeam } from '@/hooks/useTeam.ts'
import { RotateCcw } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents.ts'
import DownloadPdfButton from '@/component/DownloadPdfButton/DownloadPdfButton.tsx'
import { PdfType } from '@/config/PdfType.ts'
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

const yearSelect = [
  { label: 'all', value: 'All' },
  { label: '2024', value: '2024' },
]

type playerStatsSchemaIn = Partial<z.input<typeof playerStatsSchema>>
type playerStatsSchemaOut = z.output<typeof playerStatsSchema>

export default function PlayerStats() {
  const { playerId, teamId } = useParams()
  const { player } = usePlayer(playerId)
  const { team } = useTeam(teamId)
  const { events } = useEvents()
  const dispatch = useAppDispatch()
  const { performanceByPlayerId } = useSelector(playerPerformanceSelector)

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

  useEffect(() => {
    if(playerId) {
      dispatch(getPerformancesForPlayerThunk({ playerId }))
    }
  }, [dispatch, playerId])

  if(!player || team === null) {
    return null
  }
  const dateRange = form.watch('dateRange') as DateRange
  const year = form.watch('year')
  const hasFilters = !!year || !!(dateRange?.from || dateRange?.to)

  const filteredData = performanceByPlayerId.filter((performance) => {
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

  return (
    <DashboardLayout>
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className='flex justify-between items-center'>
          <Form {...form}>
            <form>
              <div className='grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2'>
                <div className='col-span-1' >
                  <div className='text-sub-text text-xs'>Filter by Year</div>
                  <SelectFormField
                    control={form.control}
                    name='year'
                    options={yearSelect}
                    inputClassName='w-48 h-10'
                  />
                </div>
                <div className='col-span-1' >
                  <div className='text-sub-text text-xs'>Filter by Date Range</div>
                  <DatePickerField control={form.control} name='dateRange' />
                </div>
              </div>
            </form>
          </Form>
          <div className='text-center'>
            {hasFilters && (<><div className='text-sub-text text-xs'>Reset Filter</div>
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
              totalMatchesPlayed: filteredData.length,
              totalMinutesPlayed: 0,
              calculatedAge: calculateAge(player.birthDate),
              offensiveData,
              defensiveData,
              possessionData,
              disciplinaryData,
              goalkeeperData,
              offensiveChartData,
              defensiveChartData,
              possessionChartData,
              disciplinaryChartData,
              goalkeeperChartData,
            }}
          />
        </div>
      </div>
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className='text-sub-text mb-5'>Player Stats</div>
        <div className='flex justify-between items-center pb-5 border-b border-border-line'>
          <ProfileTeamImage playerId={playerId} teamId={teamId}/>
        </div>
        <div className='grid grid-cols-3 gap-10 mt-5'>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>AGE</div>
            <div className='text-xs'>{calculateAge(player.birthDate)}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>POSITION</div>
            <div className='text-xs'>{player.position}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>JERSEY NUMBER</div>
            <div className='text-xs'>{player.uniformNumber}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>TOTAL MINUTES PLAYED</div>
            <div className='text-xs'>{0}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>TOTAL MATCHES PLAYED</div>
            <div className='text-xs'>{filteredData.length}</div>
          </div>
        </div>
      </div>
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className='my-5'>
          <Tabs defaultValue='offensive'>
            <TabsList className='bg-transparent contents md:grid md:grid-cols-5 gap-3 p-0 mb-5'>
              <TabsTrigger
                value='offensive'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'>Offensive</TabsTrigger>
              <TabsTrigger
                value='defensive'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                  Defensive
              </TabsTrigger>
              <TabsTrigger
                value='possession'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                  Possession
              </TabsTrigger>
              <TabsTrigger
                value='disciplinary'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                  Disciplinary
              </TabsTrigger>
              <TabsTrigger
                value='goalkeeping'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                  Goalkeeping
              </TabsTrigger>
            </TabsList>
            <TabsContent value='offensive' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={OffensiveMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='defensive' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={DefensiveMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='possession' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={PossessionMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='disciplinary' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={DisciplineMetric} actions={aggregatePlayerData}/>
            </TabsContent>
            <TabsContent value='goalkeeping' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={GoalkeepingMetrics} actions={aggregatePlayerData}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
