import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useIsMobile } from '@/hooks/use-mobile'

type PlayerPerformanceChartProps = {
  performanceData: {
    month: string
    rating: number
    goals: number
    assists: number
  }[]
}

export function PlayerPerformanceChart({ performanceData }: PlayerPerformanceChartProps) {
  const isMobile = useIsMobile()

  return (
    <Card className='shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className={isMobile ? 'h-60' : 'h-80'}>
          <ChartContainer
            config={{
              rating: { color: 'hsl(var(--primary))' },
              goals: { color: '#10b981' },
              assists: { color: '#f59e0b' },
            }}
            className='h-[inherit] [width:-webkit-fill-available]'
          >
            <LineChart
              data={performanceData}
              margin={{
                top: 5,
                right: isMobile ? 10 : 30,
                left: isMobile ? 0 : 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='month'
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 5 : 10}
              />
              <YAxis
                yAxisId='left'
                orientation='left'
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 5 : 10}
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                domain={[0, 10]}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 5 : 10}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend
                wrapperStyle={{
                  paddingTop: isMobile ? 5 : 10,
                  fontSize: isMobile ? 10 : 12,
                }}
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='rating'
                stroke='var(--color-rating)'
                activeDot={{ r: isMobile ? 6 : 8 }}
                name='Rating'
                strokeWidth={2}
              />
              <Line
                yAxisId='left'
                type='monotone'
                dataKey='goals'
                stroke='var(--color-goals)'
                name='Goals'
              />
              <Line
                yAxisId='left'
                type='monotone'
                dataKey='assists'
                stroke='var(--color-assists)'
                name='Assists'
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
