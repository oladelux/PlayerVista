import { AreaChart, ArrowRight, BarChart, UserCheck } from 'lucide-react'
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

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type PerformanceData = {
  month: string
  goals: number
  assists: number
  minutes: number
  passes: number
  tackles: number
  shots: number
  accuracy: number
  distance: number
}

const performanceData: PerformanceData[] = [
  {
    month: 'Jan',
    goals: 3,
    assists: 2,
    minutes: 450,
    passes: 320,
    tackles: 18,
    shots: 12,
    accuracy: 72,
    distance: 38.2,
  },
  {
    month: 'Feb',
    goals: 2,
    assists: 4,
    minutes: 520,
    passes: 345,
    tackles: 22,
    shots: 9,
    accuracy: 68,
    distance: 42.1,
  },
  {
    month: 'Mar',
    goals: 5,
    assists: 1,
    minutes: 580,
    passes: 410,
    tackles: 25,
    shots: 18,
    accuracy: 79,
    distance: 46.5,
  },
  {
    month: 'Apr',
    goals: 4,
    assists: 2,
    minutes: 430,
    passes: 290,
    tackles: 16,
    shots: 14,
    accuracy: 74,
    distance: 35.8,
  },
  {
    month: 'May',
    goals: 2,
    assists: 3,
    minutes: 490,
    passes: 325,
    tackles: 20,
    shots: 10,
    accuracy: 70,
    distance: 41.3,
  },
  {
    month: 'Jun',
    goals: 1,
    assists: 5,
    minutes: 540,
    passes: 380,
    tackles: 27,
    shots: 11,
    accuracy: 65,
    distance: 44.7,
  },
]

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

export function PlayerPerformanceCard() {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2'>
          <UserCheck size={18} className='text-muted-foreground' />
          Player Performance
        </CardTitle>
        <CardDescription>Key player stats over time</CardDescription>
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
