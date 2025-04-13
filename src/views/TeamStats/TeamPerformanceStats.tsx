import { format } from 'date-fns'
import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { combineDateAndTime } from '@/utils/dateObject'

import { TeamType } from './TeamStats'

// Custom tooltip component
type CustomTooltipProps = {
  active: boolean
  payload: CustomTooltipPayload[]
  label: string
}

type CustomTooltipPayload = {
  color: string
  name: string
  value: number
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-md border border-border bg-background p-2 text-xs shadow-sm'>
        <p className='font-medium'>{label}</p>
        {payload.map((entry: CustomTooltipPayload, index: number) => (
          <div key={index} className='mt-1 flex items-center gap-1.5'>
            <div className='size-2 rounded-full' style={{ backgroundColor: entry.color }} />
            <span className='text-muted-foreground'>
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

type TeamPerformanceStatsProps = {
  teamData: TeamType
}

export function TeamPerformanceStats({ teamData }: TeamPerformanceStatsProps) {
  // Create performance data from real events
  const getPerformanceData = () => {
    // Get the last 8 months of data
    const months = []
    const today = new Date()

    for (let i = 7; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push(format(date, 'MMM'))
    }

    // Create empty performance data structure with months
    const performanceData = months.map(month => ({
      month,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    }))

    // Fill with real data if we have past matches
    if (teamData.pastMatches && teamData.pastMatches.length > 0) {
      teamData.pastMatches.forEach(match => {
        const matchDate = new Date(combineDateAndTime(match.date, match.time))
        const monthStr = format(matchDate, 'MMM')

        // Find the corresponding month in our data
        const monthData = performanceData.find(data => data.month === monthStr)
        if (monthData) {
          // Increment counters
          monthData.played += 1

          // Determine match result
          const isHome = match.matchType === 'home'
          const homeScore = match.homeScore ?? 0
          const awayScore = match.awayScore ?? 0

          if (homeScore === awayScore) {
            monthData.drawn += 1
          } else if ((isHome && homeScore > awayScore) || (!isHome && awayScore > homeScore)) {
            monthData.won += 1
          } else {
            monthData.lost += 1
          }

          // Add goals
          if (isHome) {
            monthData.goalsFor += homeScore
            monthData.goalsAgainst += awayScore
          } else {
            monthData.goalsFor += awayScore
            monthData.goalsAgainst += homeScore
          }
        }
      })
    }

    return performanceData
  }

  // Generate results data from real matches
  const getResultsData = () => {
    return [
      { name: 'Won', value: teamData.stats.won },
      { name: 'Drawn', value: teamData.stats.drawn },
      { name: 'Lost', value: teamData.stats.lost },
    ]
  }

  const COLORS = ['#10b981', '#f59e0b', '#ef4444']

  // Get top scorers from the team's past matches
  const getPlayerContributions = () => {
    if (!teamData.pastMatches || !teamData.players) return []

    // Create a map to track player contributions
    const playerStats = new Map()

    // Initialize with player data if available
    if (teamData.players) {
      teamData.players.forEach(player => {
        playerStats.set(player.id, {
          name: player.firstName + ' ' + player.lastName,
          goals: 0,
          assists: 0,
        })
      })
    }

    // Count goals and assists from past matches
    // This is a placeholder - actual implementation would depend on your data structure
    // You would need to have player goal and assist data in your past matches

    // Convert to array and sort by goals
    return Array.from(playerStats.values())
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
      .slice(0, 5)
  }

  const performanceData = getPerformanceData()
  const resultsData = getResultsData()
  const playerContributions = getPlayerContributions()

  return (
    <div className='animate-fade-in space-y-6'>
      {/* Season summary cards */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
        <Card className='bg-gradient-to-br from-primary/5 to-primary/10'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='mb-1 text-sm text-muted-foreground'>Matches Played</p>
            <p className='text-2xl font-bold'>{teamData.stats.played}</p>
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='mb-1 text-sm text-muted-foreground'>Won</p>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {teamData.stats.won}
            </p>
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='mb-1 text-sm text-muted-foreground'>Drawn</p>
            <p className='text-2xl font-bold text-amber-600 dark:text-amber-400'>
              {teamData.stats.drawn}
            </p>
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='mb-1 text-sm text-muted-foreground'>Lost</p>
            <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
              {teamData.stats.lost}
            </p>
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='mb-1 text-sm text-muted-foreground'>Goal Difference</p>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {teamData.stats.goalsFor - teamData.stats.goalsAgainst}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Tabs defaultValue='results' className='w-full'>
        <TabsList className='grid w-full max-w-md grid-cols-4 bg-muted/60 p-1'>
          <TabsTrigger
            value='results'
            className='rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-primary/10'
          >
            Results
          </TabsTrigger>
          <TabsTrigger
            value='scoring'
            className='rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-primary/10'
          >
            Scoring
          </TabsTrigger>
          <TabsTrigger
            value='possession'
            className='rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-primary/10'
          >
            Possession
          </TabsTrigger>
          <TabsTrigger
            value='players'
            className='rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-primary/10'
          >
            Players
          </TabsTrigger>
        </TabsList>

        <TabsContent value='results' className='space-y-6 pt-4'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <Card className='col-span-1 bg-white shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/30'>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center space-x-2 text-lg'>
                  <span>Results by Month</span>
                  <Badge variant='outline' className='ml-auto'>
                    {teamData.stats.won + teamData.stats.drawn + teamData.stats.lost} Games
                  </Badge>
                </CardTitle>
                <CardDescription>Monthly performance breakdown</CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='h-80'>
                  <ChartContainer
                    config={{
                      won: { color: '#10b981' },
                      drawn: { color: '#f59e0b' },
                      lost: { color: '#ef4444' },
                    }}
                  >
                    <RechartsBarChart
                      data={performanceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      stackOffset='sign'
                    >
                      <CartesianGrid strokeDasharray='3 3' vertical={false} />
                      <XAxis dataKey='month' />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey='won'
                        fill='var(--color-won)'
                        name='Won'
                        stackId='stack'
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey='drawn'
                        fill='var(--color-drawn)'
                        name='Drawn'
                        stackId='stack'
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey='lost'
                        fill='var(--color-lost)'
                        name='Lost'
                        stackId='stack'
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className='col-span-1 bg-white shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/30'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Results Distribution</CardTitle>
                <CardDescription>Win, draw and loss percentage</CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={resultsData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={60}
                        fill='#8884d8'
                        dataKey='value'
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {resultsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip active={true} payload={[]} label={''} />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='bg-white shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/30'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Points Over Time</CardTitle>
              <CardDescription>Cumulative points throughout the season</CardDescription>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={performanceData.map((d, i) => ({
                      ...d,
                      points: d.won * 3 + d.drawn * 1,
                      cumulativePoints: performanceData
                        .slice(0, i + 1)
                        .reduce((sum, item) => sum + item.won * 3 + item.drawn * 1, 0),
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip content={<CustomTooltip active={true} payload={[]} label={''} />} />
                    <Line
                      type='monotone'
                      dataKey='points'
                      stroke='#10b981'
                      strokeWidth={2}
                      name='Points in Month'
                    />
                    <Line
                      type='monotone'
                      dataKey='cumulativePoints'
                      stroke='hsl(var(--primary))'
                      strokeWidth={2}
                      name='Total Points'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='scoring' className='space-y-6 pt-4'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <Card className='col-span-1 bg-white shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/30'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Goals Scored & Conceded</CardTitle>
                <CardDescription>Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='h-80'>
                  <ChartContainer
                    config={{
                      goalsFor: { color: 'hsl(var(--primary))' },
                      goalsAgainst: { color: '#ef4444' },
                    }}
                  >
                    <RechartsBarChart
                      data={performanceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' vertical={false} />
                      <XAxis dataKey='month' />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey='goalsFor'
                        fill='var(--color-goalsFor)'
                        name='Goals Scored'
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey='goalsAgainst'
                        fill='var(--color-goalsAgainst)'
                        name='Goals Conceded'
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className='col-span-1 bg-white shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/30'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-lg'>Goal Difference Over Time</CardTitle>
                <CardDescription>Monthly goal difference trend</CardDescription>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='h-80'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart
                      data={performanceData.map(d => ({
                        ...d,
                        goalDifference: d.goalsFor - d.goalsAgainst,
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' vertical={false} />
                      <XAxis dataKey='month' />
                      <YAxis />
                      <Tooltip content={<CustomTooltip active={true} payload={[]} label={''} />} />
                      <Area
                        type='monotone'
                        dataKey='goalDifference'
                        stroke='hsl(var(--primary))'
                        fill='hsl(var(--primary) / 0.2)'
                        name='Goal Difference'
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals summary cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <Card className='bg-gradient-to-br from-primary/5 to-primary/10'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Goals Scored</p>
                    <p className='mt-1 text-3xl font-bold'>{teamData.stats.goalsFor}</p>
                  </div>
                  <Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'>
                    <TrendingUp className='mr-1 size-3.5' />
                    {(teamData.stats.goalsFor / teamData.stats.played).toFixed(1)} per game
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-primary/5 to-primary/10'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Goals Conceded</p>
                    <p className='mt-1 text-3xl font-bold'>{teamData.stats.goalsAgainst}</p>
                  </div>
                  <Badge className='bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'>
                    <TrendingDown className='mr-1 size-3.5' />
                    {(teamData.stats.goalsAgainst / teamData.stats.played).toFixed(1)} per game
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-primary/5 to-primary/10'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Clean Sheets</p>
                    <p className='mt-1 text-3xl font-bold'>{teamData.stats.cleanSheets}</p>
                  </div>
                  <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
                    {((teamData.stats.cleanSheets / teamData.stats.played) * 100).toFixed(0)}% of
                    games
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='possession' className='space-y-6 pt-4'>
          <Card className='bg-white shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/30'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Possession & Pass Statistics</CardTitle>
              <CardDescription>Overall team performance metrics</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6 p-6'>
              <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Average Possession</span>
                      <span className='text-sm font-semibold'>{teamData.stats.possession}%</span>
                    </div>
                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div
                        className='absolute left-0 top-0 h-full rounded-full bg-primary'
                        style={{ width: `${teamData.stats.possession}%` }}
                      ></div>
                    </div>
                    <p className='text-xs text-muted-foreground'>League Average: 50%</p>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Pass Accuracy</span>
                      <span className='text-sm font-semibold'>{teamData.stats.passAccuracy}%</span>
                    </div>
                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div
                        className='absolute left-0 top-0 h-full rounded-full bg-primary'
                        style={{ width: `${teamData.stats.passAccuracy}%` }}
                      ></div>
                    </div>
                    <p className='text-xs text-muted-foreground'>League Average: 78%</p>
                  </div>
                </div>

                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Shots per Game</span>
                      <span className='text-sm font-semibold'>{teamData.stats.shotsPerGame}</span>
                    </div>
                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div
                        className='absolute left-0 top-0 h-full rounded-full bg-primary'
                        style={{ width: `${teamData.stats.shotsPerGame * 5}%` }}
                      ></div>
                    </div>
                    <p className='text-xs text-muted-foreground'>League Average: 12.5</p>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Tackles per Game</span>
                      <span className='text-sm font-semibold'>{teamData.stats.tacklesPerGame}</span>
                    </div>
                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div
                        className='absolute left-0 top-0 h-full rounded-full bg-primary'
                        style={{ width: `${teamData.stats.tacklesPerGame * 3}%` }}
                      ></div>
                    </div>
                    <p className='text-xs text-muted-foreground'>League Average: 16.2</p>
                  </div>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <Card className='bg-gradient-to-br from-primary/5 to-primary/10'>
                  <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
                    <p className='mb-1 text-sm text-muted-foreground'>Pass Success</p>
                    <div className='relative my-2 size-20'>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <p className='text-2xl font-bold'>{teamData.stats.passAccuracy}%</p>
                      </div>
                      <svg className='size-20' viewBox='0 0 36 36'>
                        <path
                          d='M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='hsl(var(--muted))'
                          strokeWidth='2'
                          strokeDasharray='100, 100'
                        />
                        <path
                          d='M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='hsl(var(--primary))'
                          strokeWidth='2'
                          strokeDasharray={`${teamData.stats.passAccuracy}, 100`}
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-primary/5 to-primary/10'>
                  <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
                    <p className='mb-1 text-sm text-muted-foreground'>Possession</p>
                    <div className='relative my-2 size-20'>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <p className='text-2xl font-bold'>{teamData.stats.possession}%</p>
                      </div>
                      <svg className='size-20' viewBox='0 0 36 36'>
                        <path
                          d='M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='hsl(var(--muted))'
                          strokeWidth='2'
                          strokeDasharray='100, 100'
                        />
                        <path
                          d='M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='hsl(var(--primary))'
                          strokeWidth='2'
                          strokeDasharray={`${teamData.stats.possession}, 100`}
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-primary/5 to-primary/10'>
                  <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
                    <p className='mb-1 text-sm text-muted-foreground'>Shots Accuracy</p>
                    <div className='relative my-2 size-20'>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <p className='text-2xl font-bold'>42%</p>
                      </div>
                      <svg className='size-20' viewBox='0 0 36 36'>
                        <path
                          d='M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='hsl(var(--muted))'
                          strokeWidth='2'
                          strokeDasharray='100, 100'
                        />
                        <path
                          d='M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='hsl(var(--primary))'
                          strokeWidth='2'
                          strokeDasharray='42, 100'
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='players' className='space-y-6 pt-4'>
          <Card className='bg-white shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/30'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Player Contributions</CardTitle>
              <CardDescription>Goals and assists by player</CardDescription>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='h-80'>
                <ChartContainer
                  config={{
                    goals: { color: 'hsl(var(--primary))' },
                    assists: { color: 'hsl(var(--primary) / 0.5)' },
                  }}
                  className='h-[inherit] [width:-webkit-fill-available]'
                >
                  <RechartsBarChart
                    data={playerContributions}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    layout='vertical'
                  >
                    <CartesianGrid strokeDasharray='3 3' horizontal={false} />
                    <XAxis type='number' />
                    <YAxis type='category' dataKey='name' width={100} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey='goals'
                      fill='var(--color-goals)'
                      name='Goals'
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey='assists'
                      fill='var(--color-assists)'
                      name='Assists'
                      radius={[0, 4, 4, 0]}
                    />
                  </RechartsBarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top performers */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {playerContributions.length > 0 ? (
              <>
                <Card className='bg-gradient-to-br from-orange-50 to-amber-100 dark:from-amber-950/20 dark:to-orange-900/20'>
                  <CardContent className='p-4'>
                    <p className='mb-3 text-xs font-medium text-muted-foreground'>TOP GOALSCORER</p>
                    <div className='flex items-center space-x-3'>
                      <div className='flex size-12 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-900'>
                        <span className='font-bold text-amber-600 dark:text-amber-300'>
                          {playerContributions[0]?.name
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('') || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <p className='font-semibold'>{playerContributions[0]?.name || 'No data'}</p>
                        <p className='text-sm'>
                          <span className='font-medium'>{playerContributions[0]?.goals || 0}</span>{' '}
                          Goals
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-cyan-950/20 dark:to-blue-900/20'>
                  <CardContent className='p-4'>
                    <p className='mb-3 text-xs font-medium text-muted-foreground'>TOP ASSISTS</p>
                    <div className='flex items-center space-x-3'>
                      <div className='flex size-12 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-900'>
                        <span className='font-bold text-blue-600 dark:text-blue-300'>
                          {playerContributions
                            .sort((a, b) => b.assists - a.assists)[0]
                            ?.name?.split(' ')
                            .map((n: string) => n[0])
                            .join('') || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <p className='font-semibold'>
                          {playerContributions.sort((a, b) => b.assists - a.assists)[0]?.name ||
                            'No data'}
                        </p>
                        <p className='text-sm'>
                          <span className='font-medium'>
                            {playerContributions.sort((a, b) => b.assists - a.assists)[0]
                              ?.assists || 0}
                          </span>{' '}
                          Assists
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-indigo-950/20 dark:to-purple-900/20'>
                  <CardContent className='p-4'>
                    <p className='mb-3 text-xs font-medium text-muted-foreground'>MOST MINUTES</p>
                    <div className='flex items-center space-x-3'>
                      <div className='flex size-12 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900'>
                        <span className='font-bold text-purple-600 dark:text-purple-300'>
                          {teamData.players && teamData.players.length > 0
                            ? teamData.players[0]?.firstName?.charAt(0) +
                              teamData.players[0]?.lastName?.charAt(0)
                            : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <p className='font-semibold'>
                          {teamData.players && teamData.players.length > 0
                            ? `${teamData.players[0]?.firstName} ${teamData.players[0]?.lastName}`
                            : 'No data'}
                        </p>
                        <p className='text-sm'>
                          <span className='font-medium'>
                            {teamData.players && teamData.players.length > 0 ? '—' : 0}
                          </span>{' '}
                          Minutes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Default display if no player data is available
              Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20'
                >
                  <CardContent className='p-4'>
                    <p className='mb-3 text-xs font-medium text-muted-foreground'>
                      {i === 0 ? 'TOP GOALSCORER' : i === 1 ? 'TOP ASSISTS' : 'MOST MINUTES'}
                    </p>
                    <div className='flex items-center space-x-3'>
                      <div className='flex size-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800'>
                        <span className='font-bold text-gray-600 dark:text-gray-400'>—</span>
                      </div>
                      <div>
                        <p className='font-semibold'>No data available</p>
                        <p className='text-sm'>
                          <span className='font-medium'>0</span>{' '}
                          {i === 0 ? 'Goals' : i === 1 ? 'Assists' : 'Minutes'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            <Card className='bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-950/20 dark:to-green-900/20'>
              <CardContent className='p-4'>
                <p className='mb-3 text-xs font-medium text-muted-foreground'>CLEAN SHEETS</p>
                <div className='flex items-center space-x-3'>
                  <div className='flex size-12 items-center justify-center rounded-full bg-green-200 dark:bg-green-900'>
                    <span className='font-bold text-green-600 dark:text-green-300'>GK</span>
                  </div>
                  <div>
                    <p className='font-semibold'>Goalkeeper</p>
                    <p className='text-sm'>
                      <span className='font-medium'>{teamData.stats.cleanSheets}</span> Clean Sheets
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
