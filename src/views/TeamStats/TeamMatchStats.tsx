import React, { useState } from 'react'

import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Eye,
  Flag,
  List,
  Search,
} from 'lucide-react'

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
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TeamMatchStatsProps = {
  teamData: any
  matchesData: Array<{
    id: number
    opponent: string
    date: string
    venue: string
    result: string
    possession: number
    shots: number
    passes: number
    tackles: number
  }>
}

export function TeamMatchStats({ teamData, matchesData }: TeamMatchStatsProps) {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<string>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Sort matches data
  const sortedMatches = [...matchesData].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortOrder === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime()
    } else if (sortBy === 'opponent') {
      return sortOrder === 'asc'
        ? a.opponent.localeCompare(b.opponent)
        : b.opponent.localeCompare(a.opponent)
    } else if (sortBy === 'possession') {
      return sortOrder === 'asc' ? a.possession - b.possession : b.possession - a.possession
    } else if (sortBy === 'shots') {
      return sortOrder === 'asc' ? a.shots - b.shots : b.shots - a.shots
    }
    return 0
  })

  // Mock match detail data
  const matchDetail = {
    id: 3,
    opponent: 'Newcastle',
    date: '2023-08-26',
    venue: 'Home',
    result: 'W 3-0',
    possession: 62,
    shots: 18,
    passes: 578,
    tackles: 14,
    details: {
      scorers: ["Rashford (23', 67')", "Fernandes (52')"],
      formation: '4-3-3',
      yellowCards: ['Casemiro', 'Martinez'],
      redCards: [],
      corners: 8,
      freeKicks: 6,
      offsides: 3,
      shotsOnTarget: 12,
      shotsOffTarget: 6,
      passAccuracy: 86,
      clearances: 12,
      foulsCommitted: 9,
      foulsReceived: 14,
      opponentPasses: 312,
      opponentShots: 7,
      opponentShotsOnTarget: 2,
      opponentPossession: 38,
      xG: 2.8,
      opponentXG: 0.6,
      keyPasses: 14,
      interceptions: 10,
      blocks: 6,
      counterAttacks: 9,
      successfulCounters: 4,
    },
  }

  const handleMatchClick = (matchId: number) => {
    setSelectedMatch(matchId === selectedMatch ? null : matchId)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const getResultColor = (result: string) => {
    if (result.startsWith('W')) return 'text-emerald-600 dark:text-emerald-400'
    if (result.startsWith('D')) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getResultBadgeColor = (result: string) => {
    if (result.startsWith('W'))
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    if (result.startsWith('D'))
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const renderMatchCard = (match: (typeof matchesData)[0]) => {
    const isSelected = match.id === selectedMatch
    const resultBadgeColor = getResultBadgeColor(match.result)

    return (
      <Card
        key={match.id}
        className={`transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={() => handleMatchClick(match.id)}
      >
        <CardHeader className='pb-2'>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='text-base font-semibold'>{match.opponent}</CardTitle>
              <CardDescription>
                {formatDate(match.date)} • {match.venue}
              </CardDescription>
            </div>
            <Badge className={resultBadgeColor}>{match.result}</Badge>
          </div>
        </CardHeader>
        <CardContent className='pb-4'>
          <div className='mt-2 grid grid-cols-3 gap-2'>
            <div className='text-center'>
              <div className='text-lg font-semibold'>{match.possession}%</div>
              <div className='text-xs text-muted-foreground'>Possession</div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-semibold'>{match.shots}</div>
              <div className='text-xs text-muted-foreground'>Shots</div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-semibold'>{match.passes}</div>
              <div className='text-xs text-muted-foreground'>Passes</div>
            </div>
          </div>
          {isSelected && match.id === matchDetail.id && (
            <Button
              variant='ghost'
              size='sm'
              className='mt-3 flex w-full items-center justify-center gap-1 text-primary'
            >
              <Eye size={16} />
              View Details
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='animate-fade-in space-y-6'>
      {/* Filters and view options */}
      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
          <Input type='search' placeholder='Search matches...' className='pl-8' />
        </div>

        <div className='flex gap-2'>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='date'>Date</SelectItem>
              <SelectItem value='opponent'>Opponent</SelectItem>
              <SelectItem value='possession'>Possession</SelectItem>
              <SelectItem value='shots'>Shots</SelectItem>
            </SelectContent>
          </Select>

          <Button variant='outline' size='icon' onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? (
              <ChevronUp className='size-4' />
            ) : (
              <ChevronDown className='size-4' />
            )}
          </Button>

          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size='icon'
            onClick={() => setViewMode('grid')}
          >
            <BarChart3 className='size-4' />
          </Button>

          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size='icon'
            onClick={() => setViewMode('list')}
          >
            <List className='size-4' />
          </Button>
        </div>
      </div>

      {/* Quick stats summary */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <Card className='bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='text-xs text-muted-foreground'>WINS</p>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {teamData.stats.won}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/20 dark:to-amber-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='text-xs text-muted-foreground'>DRAWS</p>
            <p className='text-2xl font-bold text-amber-600 dark:text-amber-400'>
              {teamData.stats.drawn}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/20 dark:to-rose-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='text-xs text-muted-foreground'>LOSSES</p>
            <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
              {teamData.stats.lost}
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='text-xs text-muted-foreground'>GOAL DIFF</p>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {teamData.stats.goalsFor - teamData.stats.goalsAgainst}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Matches List in Grid or List view */}
      <Card className='overflow-hidden bg-white shadow-md backdrop-blur-sm dark:bg-card/30'>
        <CardHeader className='flex flex-row items-center justify-between pb-0'>
          <div>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Calendar className='size-5 text-muted-foreground' />
              Match History
            </CardTitle>
            <CardDescription>Records of all matches played this season</CardDescription>
          </div>
          <Badge variant='outline'>{matchesData.length} Matches</Badge>
        </CardHeader>

        <CardContent className='p-6'>
          {viewMode === 'grid' ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {sortedMatches.map(match => renderMatchCard(match))}
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Opponent</TableHead>
                    <TableHead className='w-[150px]'>Date</TableHead>
                    <TableHead className='w-[100px]'>Venue</TableHead>
                    <TableHead className='w-[100px]'>Result</TableHead>
                    <TableHead className='text-right'>Possession</TableHead>
                    <TableHead className='text-right'>Shots</TableHead>
                    <TableHead className='text-right'>Passes</TableHead>
                    <TableHead className='w-[50px]'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMatches.map(match => (
                    <React.Fragment key={match.id}>
                      <TableRow
                        className={`cursor-pointer hover:bg-muted/50 ${match.id === selectedMatch ? 'bg-primary/5' : ''}`}
                        onClick={() => handleMatchClick(match.id)}
                      >
                        <TableCell className='font-medium'>{match.opponent}</TableCell>
                        <TableCell>{formatDate(match.date)}</TableCell>
                        <TableCell>{match.venue}</TableCell>
                        <TableCell>
                          <span className={getResultColor(match.result)}>{match.result}</span>
                        </TableCell>
                        <TableCell className='text-right'>{match.possession}%</TableCell>
                        <TableCell className='text-right'>{match.shots}</TableCell>
                        <TableCell className='text-right'>{match.passes}</TableCell>
                        <TableCell>
                          {match.id === selectedMatch ? (
                            <ChevronDown className='size-4 text-muted-foreground' />
                          ) : (
                            <ChevronRight className='size-4 text-muted-foreground' />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Expanded Details */}
                      {selectedMatch === match.id && match.id === matchDetail.id && (
                        <TableRow className='bg-muted/30'>
                          <TableCell colSpan={8} className='p-0'>
                            <div className='space-y-4 p-4'>
                              <div className='mb-2 flex items-center justify-between'>
                                <h4 className='flex items-center gap-2 text-lg font-semibold'>
                                  <Flag className='size-4 text-primary' />
                                  Match Details
                                </h4>
                                <Badge>{matchDetail.result}</Badge>
                              </div>

                              <Tabs defaultValue='summary' className='w-full'>
                                <TabsList className='mb-4 grid w-full grid-cols-3'>
                                  <TabsTrigger value='summary'>Summary</TabsTrigger>
                                  <TabsTrigger value='stats'>Stats</TabsTrigger>
                                  <TabsTrigger value='players'>Players</TabsTrigger>
                                </TabsList>

                                <TabsContent value='summary'>
                                  {/* Match highlight */}
                                  <div className='mb-4'>
                                    <p className='mb-1 text-sm font-medium'>Goals</p>
                                    <div className='flex flex-wrap gap-2'>
                                      {matchDetail.details.scorers.map((scorer, index) => (
                                        <Badge key={index} variant='secondary'>
                                          {scorer}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className='mb-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Formation</p>
                                      <p className='font-medium'>{matchDetail.details.formation}</p>
                                    </div>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Cards</p>
                                      <p className='font-medium'>
                                        {matchDetail.details.yellowCards.length}{' '}
                                        <span className='text-amber-500'>●</span>,{' '}
                                        {matchDetail.details.redCards.length}{' '}
                                        <span className='text-red-500'>●</span>
                                      </p>
                                    </div>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Corners</p>
                                      <p className='font-medium'>{matchDetail.details.corners}</p>
                                    </div>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Free Kicks</p>
                                      <p className='font-medium'>{matchDetail.details.freeKicks}</p>
                                    </div>
                                  </div>

                                  {/* Team vs Opponent comparisons */}
                                  <div className='space-y-3'>
                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Possession</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetail.possession}%
                                          </span>
                                          <span className='w-8 text-left text-muted-foreground'>
                                            {matchDetail.details.opponentPossession}%
                                          </span>
                                        </div>
                                      </div>
                                      <div className='flex h-2 w-full overflow-hidden rounded-full bg-muted'>
                                        <div
                                          className='bg-primary'
                                          style={{ width: `${matchDetail.possession}%` }}
                                        />
                                        <div
                                          className='bg-muted-foreground/60'
                                          style={{
                                            width: `${matchDetail.details.opponentPossession}%`,
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Shots</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetail.shots}
                                          </span>
                                          <span className='w-8 text-left text-muted-foreground'>
                                            {matchDetail.details.opponentShots}
                                          </span>
                                        </div>
                                      </div>
                                      <div className='flex h-2 w-full overflow-hidden rounded-full bg-muted'>
                                        <div
                                          className='bg-primary'
                                          style={{
                                            width: `${(matchDetail.shots / (matchDetail.shots + matchDetail.details.opponentShots)) * 100}%`,
                                          }}
                                        />
                                        <div
                                          className='bg-muted-foreground/60'
                                          style={{
                                            width: `${(matchDetail.details.opponentShots / (matchDetail.shots + matchDetail.details.opponentShots)) * 100}%`,
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Shots On Target</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetail.details.shotsOnTarget}
                                          </span>
                                          <span className='w-8 text-left text-muted-foreground'>
                                            {matchDetail.details.opponentShotsOnTarget}
                                          </span>
                                        </div>
                                      </div>
                                      <div className='flex h-2 w-full overflow-hidden rounded-full bg-muted'>
                                        <div
                                          className='bg-primary'
                                          style={{
                                            width: `${(matchDetail.details.shotsOnTarget / (matchDetail.details.shotsOnTarget + matchDetail.details.opponentShotsOnTarget)) * 100}%`,
                                          }}
                                        />
                                        <div
                                          className='bg-muted-foreground/60'
                                          style={{
                                            width: `${(matchDetail.details.opponentShotsOnTarget / (matchDetail.details.shotsOnTarget + matchDetail.details.opponentShotsOnTarget)) * 100}%`,
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Expected Goals (xG)</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetail.details.xG.toFixed(1)}
                                          </span>
                                          <span className='w-8 text-left text-muted-foreground'>
                                            {matchDetail.details.opponentXG.toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                      <div className='flex h-2 w-full overflow-hidden rounded-full bg-muted'>
                                        <div
                                          className='bg-primary'
                                          style={{
                                            width: `${(matchDetail.details.xG / (matchDetail.details.xG + matchDetail.details.opponentXG)) * 100}%`,
                                          }}
                                        />
                                        <div
                                          className='bg-muted-foreground/60'
                                          style={{
                                            width: `${(matchDetail.details.opponentXG / (matchDetail.details.xG + matchDetail.details.opponentXG)) * 100}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value='stats'>
                                  <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                                    <Card>
                                      <CardContent className='p-4'>
                                        <p className='text-xs text-muted-foreground'>
                                          Pass Accuracy
                                        </p>
                                        <p className='text-lg font-semibold'>
                                          {matchDetail.details.passAccuracy}%
                                        </p>
                                        <Progress
                                          value={matchDetail.details.passAccuracy}
                                          className='mt-2 h-1.5'
                                        />
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardContent className='p-4'>
                                        <p className='text-xs text-muted-foreground'>Key Passes</p>
                                        <p className='text-lg font-semibold'>
                                          {matchDetail.details.keyPasses}
                                        </p>
                                        <Progress
                                          value={matchDetail.details.keyPasses * 5}
                                          className='mt-2 h-1.5'
                                        />
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardContent className='p-4'>
                                        <p className='text-xs text-muted-foreground'>
                                          Interceptions
                                        </p>
                                        <p className='text-lg font-semibold'>
                                          {matchDetail.details.interceptions}
                                        </p>
                                        <Progress
                                          value={matchDetail.details.interceptions * 6}
                                          className='mt-2 h-1.5'
                                        />
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardContent className='p-4'>
                                        <p className='text-xs text-muted-foreground'>
                                          Counter Attacks
                                        </p>
                                        <p className='text-lg font-semibold'>
                                          {matchDetail.details.successfulCounters}/
                                          {matchDetail.details.counterAttacks}
                                        </p>
                                        <Progress
                                          value={
                                            (matchDetail.details.successfulCounters /
                                              matchDetail.details.counterAttacks) *
                                            100
                                          }
                                          className='mt-2 h-1.5'
                                        />
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <div className='mt-4 grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3'>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Corners</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.corners}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Free Kicks</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.freeKicks}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Offsides</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.offsides}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Fouls Committed</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.foulsCommitted}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Fouls Received</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.foulsReceived}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Clearances</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.clearances}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Blocks</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.blocks}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Yellow Cards</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.yellowCards.length}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Red Cards</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetail.details.redCards.length}
                                      </span>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value='players'>
                                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                    <Card>
                                      <CardHeader className='p-4 pb-2'>
                                        <CardTitle className='text-sm'>Top Performers</CardTitle>
                                      </CardHeader>
                                      <CardContent className='p-4 pt-0'>
                                        <div className='space-y-3'>
                                          <div className='flex items-center border-b pb-2'>
                                            <div className='mr-3 flex size-8 items-center justify-center rounded-full bg-primary/10'>
                                              <span className='text-xs font-medium'>MR</span>
                                            </div>
                                            <div className='flex-1'>
                                              <p className='text-sm font-medium'>M. Rashford</p>
                                              <p className='text-xs text-muted-foreground'>
                                                2 Goals
                                              </p>
                                            </div>
                                            <div className='rounded-full bg-primary/5 px-2 py-1'>
                                              <span className='text-xs font-semibold'>9.1</span>
                                            </div>
                                          </div>

                                          <div className='flex items-center border-b pb-2'>
                                            <div className='mr-3 flex size-8 items-center justify-center rounded-full bg-primary/10'>
                                              <span className='text-xs font-medium'>BF</span>
                                            </div>
                                            <div className='flex-1'>
                                              <p className='text-sm font-medium'>B. Fernandes</p>
                                              <p className='text-xs text-muted-foreground'>
                                                1 Goal, 2 Assists
                                              </p>
                                            </div>
                                            <div className='rounded-full bg-primary/5 px-2 py-1'>
                                              <span className='text-xs font-semibold'>8.9</span>
                                            </div>
                                          </div>

                                          <div className='flex items-center'>
                                            <div className='mr-3 flex size-8 items-center justify-center rounded-full bg-primary/10'>
                                              <span className='text-xs font-medium'>LM</span>
                                            </div>
                                            <div className='flex-1'>
                                              <p className='text-sm font-medium'>L. Martinez</p>
                                              <p className='text-xs text-muted-foreground'>
                                                5 Clearances, 3 Blocks
                                              </p>
                                            </div>
                                            <div className='rounded-full bg-primary/5 px-2 py-1'>
                                              <span className='text-xs font-semibold'>8.5</span>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className='p-4 pb-2'>
                                        <CardTitle className='text-sm'>Substitutions</CardTitle>
                                      </CardHeader>
                                      <CardContent className='p-4 pt-0'>
                                        <div className='space-y-2'>
                                          <div className='flex items-center justify-between text-sm'>
                                            <div className='flex items-center gap-2'>
                                              <Badge
                                                variant='outline'
                                                className='flex size-6 items-center justify-center rounded-full p-0 font-normal'
                                              >
                                                68'
                                              </Badge>
                                              <span>A. Martial</span>
                                              <ChevronRight className='size-3.5 text-muted-foreground' />
                                              <span>M. Rashford</span>
                                            </div>
                                          </div>

                                          <div className='flex items-center justify-between text-sm'>
                                            <div className='flex items-center gap-2'>
                                              <Badge
                                                variant='outline'
                                                className='flex size-6 items-center justify-center rounded-full p-0 font-normal'
                                              >
                                                75'
                                              </Badge>
                                              <span>F. Pellistri</span>
                                              <ChevronRight className='size-3.5 text-muted-foreground' />
                                              <span>J. Sancho</span>
                                            </div>
                                          </div>

                                          <div className='flex items-center justify-between text-sm'>
                                            <div className='flex items-center gap-2'>
                                              <Badge
                                                variant='outline'
                                                className='flex size-6 items-center justify-center rounded-full p-0 font-normal'
                                              >
                                                82'
                                              </Badge>
                                              <span>S. McTominay</span>
                                              <ChevronRight className='size-3.5 text-muted-foreground' />
                                              <span>C. Eriksen</span>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <CardFooter className='border-t bg-muted/20 px-6 py-4'>
          <div className='text-sm text-muted-foreground'>
            Showing {sortedMatches.length} matches
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
