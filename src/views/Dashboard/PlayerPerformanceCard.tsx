import { useState } from 'react'

import { AreaChart, ArrowRight, BarChart, UserCheck, Users } from 'lucide-react'
import {
  Area,
  Bar,
  CartesianGrid,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'

import { Event, Player } from '@/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePerformance } from '@/hooks/usePerformance'
import { generatePlayerDataSets } from '@/utils/players'

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-md border border-border bg-background p-2 text-xs shadow-sm'>
        <p className='font-medium'>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className='mt-1 flex items-center gap-1.5'>
            <div className='size-2 rounded-full' style={{ backgroundColor: entry.color }} />
            <span className='text-muted-foreground'>
              {entry.name}: {entry.value}
              {entry.name === 'accuracy' ? '%' : entry.name === 'distance' ? 'km' : ''}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export function PlayerPerformanceCard({
  players,
  teamId,
  events,
}: {
  players: Player[]
  teamId: string | undefined
  events: Event[]
}) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('0')
  const { performanceByTeam } = usePerformance(undefined, undefined, teamId)

  const topPlayers = players.map(player => ({
    id: player.id,
    name: player.firstName + ' ' + player.lastName,
    position: player.position,
  }))

  const playerEvents = performanceByTeam.map(performance => {
    const event = events.find(event => event.id === performance.eventId)
    return {
      ...performance,
      eventDate: event?.date,
      opponent: event?.opponent,
    }
  })

  // Get data based on selected player or team average
  const playerDataSets = generatePlayerDataSets(topPlayers, playerEvents)

  // Use the selected player ID directly as a string key
  // Fall back to team average (0) if the selected player data is not available
  const performanceData = playerDataSets[selectedPlayer] || playerDataSets['0'] || []

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            {selectedPlayer === '0' ? (
              <Users size={18} className='text-muted-foreground' />
            ) : (
              <UserCheck size={18} className='text-muted-foreground' />
            )}
            {selectedPlayer === '0' ? 'Team Performance' : 'Player Performance'}
          </CardTitle>
          <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
            <SelectTrigger className='h-8 w-[180px]'>
              <SelectValue placeholder='Select player' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Team Average</SelectItem>
              {topPlayers.map(player => (
                <SelectItem key={player.id} value={player.id.toString()}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          {selectedPlayer === '0'
            ? 'Team player stats over time'
            : `Stats for ${topPlayers.find(p => p.id.toString() === selectedPlayer)?.name || 'player'}`}
        </CardDescription>
      </CardHeader>
      <CardContent className='pb-1'>
        <Tabs defaultValue='goals' className='space-y-4'>
          <TabsList className='grid h-8 grid-cols-4'>
            <TabsTrigger value='goals' className='text-xs'>
              <BarChart size={14} className='mr-1.5' />
              Goals & Assists
            </TabsTrigger>
            <TabsTrigger value='field' className='text-xs'>
              Passes & Tackles
            </TabsTrigger>
            <TabsTrigger value='shots' className='text-xs'>
              Shots & Accuracy
            </TabsTrigger>
            <TabsTrigger value='minutes' className='text-xs'>
              <AreaChart size={14} className='mr-1.5' />
              Playing Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value='goals' className='space-y-2'>
            <div className='h-[200px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsBarChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey='goals'
                    fill='hsl(var(--primary))'
                    radius={[4, 4, 0, 0]}
                    name='Goals'
                  />
                  <Bar
                    dataKey='assists'
                    fill='hsl(var(--primary) / 0.4)'
                    radius={[4, 4, 0, 0]}
                    name='Assists'
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='field' className='space-y-2'>
            <div className='h-[200px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsBarChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey='passes' fill='#6366f1' radius={[4, 4, 0, 0]} name='Passes' />
                  <Bar dataKey='tackles' fill='#6366f1/0.4' radius={[4, 4, 0, 0]} name='Tackles' />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='shots' className='space-y-2'>
            <div className='h-[200px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsBarChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis
                    yAxisId='left'
                    orientation='left'
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis
                    yAxisId='right'
                    orientation='right'
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    yAxisId='left'
                    dataKey='shots'
                    fill='#10b981'
                    radius={[4, 4, 0, 0]}
                    name='Shots'
                  />
                  <Bar
                    yAxisId='right'
                    dataKey='accuracy'
                    fill='#10b981/0.4'
                    radius={[4, 4, 0, 0]}
                    name='Accuracy'
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='minutes' className='space-y-2'>
            <div className='h-[200px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsAreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type='monotone'
                    dataKey='minutes'
                    stroke='hsl(var(--primary))'
                    fill='hsl(var(--primary) / 0.2)'
                    name='Minutes'
                  />
                  <Area
                    type='monotone'
                    dataKey='distance'
                    stroke='#f59e0b'
                    fill='#f59e0b/0.2'
                    name='Distance'
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='pt-3'>
        <Button variant='ghost' className='w-full justify-between' asChild>
          <a href='/player-stats'>
            View detailed stats
            <ArrowRight size={16} />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
