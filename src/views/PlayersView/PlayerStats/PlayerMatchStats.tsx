import { useCallback, useEffect, useState } from 'react'

import { format, parseISO } from 'date-fns'
import { ArrowUpDown, Eye, Filter, X } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Player } from '@/api'
import DownloadPdfButton from '@/component/DownloadPdfButton/DownloadPdfButton'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PdfType } from '@/config/PdfType'
import { useIsMobile } from '@/hooks/use-mobile'
import { PlayerMatch } from '@/utils/players'

interface PlayerMatchStatsProps {
  playerData: Player
  matchesData: PlayerMatch[]
}

export function PlayerMatchStats({ playerData, matchesData }: PlayerMatchStatsProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedMatches, setSelectedMatches] = useState<PlayerMatch[]>([])
  const [filteredMatches, setFilteredMatches] = useState<PlayerMatch[]>(matchesData)
  const [selectedSort, setSelectedSort] = useState<string>('date')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const isMobile = useIsMobile()

  // Option 2: Wrap in useCallback
  const applyFilters = useCallback(() => {
    const sortedMatches = [...matchesData]

    if (selectedSort === 'date') {
      sortedMatches.sort((a, b) => {
        const dateA = parseISO(a.date.toISOString())
        const dateB = parseISO(b.date.toISOString())
        return sortOrder === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      })
    } else if (selectedSort === 'rating') {
      sortedMatches.sort((a, b) =>
        sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating,
      )
    } else if (selectedSort === 'goals') {
      sortedMatches.sort((a, b) => (sortOrder === 'asc' ? a.goals - b.goals : b.goals - a.goals))
    }

    setFilteredMatches(sortedMatches)
  }, [sortOrder, selectedSort, matchesData])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType)
  }

  const isMatchSelected = (matchId: string) => {
    return selectedMatches.some(match => match.id === matchId)
  }

  const toggleMatchSelection = (match: PlayerMatch) => {
    if (isMatchSelected(match.id)) {
      setSelectedMatches(prev => prev.filter(m => m.id !== match.id))
    } else {
      setSelectedMatches(prev => [...prev, match])
    }
  }

  // Create radar data from selected matches - fixed the spread operator type issue
  const radarData =
    selectedMatches.length > 0
      ? [
          { category: 'Rating', ...getSelectedMatchesData('rating') },
          { category: 'Goals', ...getSelectedMatchesData('goals') },
          { category: 'Assists', ...getSelectedMatchesData('assists') },
          { category: 'Shots', ...getSelectedMatchesData('shotsTotal') },
          { category: 'Pass Accuracy', ...getSelectedMatchesData('passAccuracy', true) },
        ]
      : []

  // Create bar chart data
  const barData = selectedMatches.map(match => ({
    name: `vs ${match.opponent}`,
    goals: match.goals,
    assists: match.assists,
    rating: match.rating,
  }))

  function getSelectedMatchesData(
    key: string,
    divideByTen: boolean = false,
  ): Record<string, number> {
    const data: Record<string, number> = {}
    selectedMatches.forEach((match, index) => {
      const value =
        match[key as keyof PlayerMatch] !== undefined ? match[key as keyof PlayerMatch] : 0
      data[`match${index}`] = divideByTen ? (value as number) / 10 : (value as number)
    })
    return data
  }

  // Render a match card
  const renderMatchCard = (match: PlayerMatch) => {
    const isSelected = isMatchSelected(match.id)
    const resultColor = match.result.startsWith('W')
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : match.result.startsWith('L')
        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'

    return (
      <Card
        key={match.id}
        className={`${isSelected ? 'ring-2 ring-primary' : ''} cursor-pointer transition-all hover:shadow-md`}
        onClick={() => toggleMatchSelection(match)}
      >
        <CardHeader className='pb-2'>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='text-lg'>{match.opponent}</CardTitle>
              <CardDescription>{format(match.date, 'PPP')}</CardDescription>
            </div>
            <Badge className={resultColor}>{match.result}</Badge>
          </div>
        </CardHeader>
        <CardContent className='pb-4 pt-0'>
          <div className='grid grid-cols-3 gap-2'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{match.goals}</div>
              <div className='text-xs text-muted-foreground'>Goals</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{match.assists}</div>
              <div className='text-xs text-muted-foreground'>Assists</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{match.rating.toFixed(1)}</div>
              <div className='text-xs text-muted-foreground'>Rating</div>
            </div>
          </div>
          {isSelected && (
            <div className='mt-3 flex justify-end'>
              <Badge variant='outline' className='font-normal'>
                Selected
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Render a match row for the table view
  const renderMatchRow = (match: PlayerMatch) => {
    const isSelected = isMatchSelected(match.id)
    const resultColor = match.result.startsWith('W')
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : match.result.startsWith('L')
        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'

    return (
      <TableRow
        key={match.id}
        className={`${isSelected ? 'bg-primary/10' : ''} cursor-pointer`}
        onClick={() => toggleMatchSelection(match)}
      >
        <TableCell className='font-medium'>{match.opponent}</TableCell>
        <TableCell>{format(match.date, 'PP')}</TableCell>
        <TableCell>
          <Badge className={resultColor}>{match.result}</Badge>
        </TableCell>
        <TableCell className='text-center'>{match.goals}</TableCell>
        <TableCell className='text-center'>{match.assists}</TableCell>
        <TableCell className='text-center'>{match.rating.toFixed(1)}</TableCell>
        <TableCell>
          {isSelected ? (
            <Badge variant='outline' className='ml-auto'>
              Selected
            </Badge>
          ) : (
            <Button size='sm' variant='ghost' className='size-8 p-0'>
              <Eye className='size-4' />
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className='animate-fade-in space-y-6'>
      {/* Export options and view toggle */}
      <div className='mb-4 flex flex-col justify-between gap-2 sm:flex-row'>
        <div className='flex flex-wrap gap-2'>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setViewMode('grid')}
            className='flex items-center gap-1.5'
            style={{ backgroundColor: viewMode === 'grid' ? 'rgb(36, 0, 38)' : undefined }}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setViewMode('list')}
            className='flex items-center gap-1.5'
            style={{ backgroundColor: viewMode === 'list' ? 'rgb(36, 0, 38)' : undefined }}
          >
            List View
          </Button>
        </div>
      </div>

      {/* Filters and Sorting */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle>Match Filters & Sorting</CardTitle>
            <Badge variant='outline' className='ml-auto'>
              {filteredMatches.length} Matches
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-1 text-xs text-muted-foreground'>Sort By</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {/* Sorting */}
            <div>
              <Select value={selectedSort} onValueChange={handleSortChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select sort' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='date'>Date</SelectItem>
                  <SelectItem value='rating'>Rating</SelectItem>
                  <SelectItem value='goals'>Goals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <Button
              variant='outline'
              size='sm'
              onClick={toggleSortOrder}
              className='flex h-auto items-center gap-2'
            >
              <ArrowUpDown size={16} />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>

            {/* Filter Status */}
            <div className='flex items-center justify-end gap-2'>
              <Badge variant='outline' className='gap-1'>
                <Filter size={12} />
                {selectedSort} ({sortOrder})
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected matches summary */}
      {selectedMatches.length > 0 && (
        <Card className='bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center justify-between'>
              <span>Selected Matches ({selectedMatches.length})</span>
              <Button
                variant='ghost'
                size='sm'
                className='size-8 p-0'
                onClick={() => setSelectedMatches([])}
              >
                <X className='size-4' />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {selectedMatches.map(match => (
                <Badge key={match.id} variant='secondary' className='px-3 py-1.5'>
                  vs {match.opponent} ({format(match.date, 'dd MMM')})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match List or Grid */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle>Match Details</CardTitle>
          <CardDescription>
            {viewMode === 'grid'
              ? 'Select matches to compare their statistics'
              : 'Click on a match row to select for comparison'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredMatches.map(match => renderMatchCard(match))}
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className='text-center'>Goals</TableHead>
                    <TableHead className='text-center'>Assists</TableHead>
                    <TableHead className='text-center'>Rating</TableHead>
                    <TableHead className='text-right'>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{filteredMatches.map(match => renderMatchRow(match))}</TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Comparison (only shown when matches are selected) */}
      {selectedMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Match Comparison</CardTitle>
            <CardDescription>Comparing {selectedMatches.length} selected matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Performance Bar Chart */}
              <div className={isMobile ? 'h-64' : 'h-80'}>
                <div className='mb-3 text-sm font-medium'>Key Stats Comparison</div>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={barData}
                    margin={{
                      top: 5,
                      right: isMobile ? 10 : 30,
                      left: isMobile ? 0 : 20,
                      bottom: isMobile ? 50 : 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis
                      dataKey='name'
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      angle={-45}
                      textAnchor='end'
                      interval={0}
                      height={60}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip />
                    <Legend
                      wrapperStyle={{
                        paddingTop: isMobile ? 5 : 10,
                        fontSize: isMobile ? 10 : 12,
                      }}
                    />
                    <Bar dataKey='goals' fill='#10b981' name='Goals' radius={[4, 4, 0, 0]} />
                    <Bar dataKey='assists' fill='#f59e0b' name='Assists' radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey='rating'
                      fill='hsl(var(--primary))'
                      name='Rating'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className={isMobile ? 'h-64' : 'h-80'}>
                <div className='mb-3 text-sm font-medium'>Performance Radar</div>
                <ResponsiveContainer width='100%' height='100%'>
                  <RadarChart outerRadius={isMobile ? 70 : 90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey='category' />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    {selectedMatches.map((match, index) => (
                      <Radar
                        key={index}
                        name={`vs ${match.opponent}`}
                        dataKey={`match${index}`}
                        stroke={
                          index === 0
                            ? 'hsl(var(--primary))'
                            : index === 1
                              ? '#f59e0b'
                              : index === 2
                                ? '#10b981'
                                : '#6366f1'
                        }
                        fill={
                          index === 0
                            ? 'hsla(var(--primary) / 0.6)'
                            : index === 1
                              ? 'rgba(245, 158, 11, 0.6)'
                              : index === 2
                                ? 'rgba(16, 185, 129, 0.6)'
                                : 'rgba(99, 102, 241, 0.6)'
                        }
                        fillOpacity={0.6}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Advanced Stats Table - Only show when 2 or fewer matches are selected */}
            {selectedMatches.length <= 2 && (
              <div className='mt-6'>
                <Separator className='my-4' />
                <div className='mb-3 font-medium'>Detailed Comparison</div>
                <div className='overflow-hidden rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Statistic</TableHead>
                        {selectedMatches.map((match, index) => (
                          <TableHead key={index}>vs {match.opponent}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className='font-medium'>Minutes Played</TableCell>
                        {selectedMatches.map((match, index) => (
                          <TableCell key={index}>{match.minutesPlayed || '-'}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Pass Accuracy</TableCell>
                        {selectedMatches.map((match, index) => (
                          <TableCell key={index}>{match.passAccuracy || '-'}%</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Shots (On Target)</TableCell>
                        {selectedMatches.map((match, index) => (
                          <TableCell key={index}>
                            {match.shotsOnTarget || '-'}/{match.shots || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Dribbles</TableCell>
                        {selectedMatches.map((match, index) => (
                          <TableCell key={index}>
                            {match.successfulDribbles || '-'}/{match.dribbles || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Chances Created</TableCell>
                        {selectedMatches.map((match, index) => (
                          <TableCell key={index}>{match.chancesCreated || '-'}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setSelectedMatches([])}
              disabled={selectedMatches.length === 0}
            >
              Clear Selection
            </Button>
            <DownloadPdfButton
              templateName='fullPlayerReport'
              filename={`${playerData.lastName}_${playerData.firstName}`}
              pdfType={PdfType.FULL_PLAYER_REPORT}
              data={playerData}
            />
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
