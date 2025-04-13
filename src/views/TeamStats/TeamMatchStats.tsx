import { Fragment, useCallback, useEffect, useState } from 'react'

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
import { aggregatePlayerActions } from '@/utils/phaseMetrics'
import {
  getDefensiveData,
  getDisciplinaryData,
  getOffensiveData,
  getPossessionData,
} from '@/utils/players'

import { TeamType } from './TeamStats'

type TeamMatchStatsProps = {
  teamData: TeamType
  matchesData: Array<{
    id: string
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

// Define an interface for match details
interface MatchDetails {
  id: string
  opponent: string
  date: string
  venue: string
  result: string
  possession: number
  shots: number
  passes: number
  tackles: number
  details: {
    scorers: string[]
    formation: string
    yellowCards: string[]
    redCards: string[]
    corners: number
    freeKicks: number
    offsides: number
    shotsOnTarget: number
    shotsOffTarget: number
    passAccuracy: number
    clearances: number
    foulsCommitted: number
    foulsReceived: number
    xG: number
    interceptions: number
    blocks: number
  }
}

export function TeamMatchStats({ teamData, matchesData }: TeamMatchStatsProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<string>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null)

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

  // Function to get match details based on real data
  const getMatchDetail = useCallback(
    (matchId: string): MatchDetails | null => {
      // Find the selected match
      const match = matchesData.find(m => m.id === matchId)
      if (!match) return null

      // Find relevant performance data for this match from team data
      const matchPerformances =
        teamData.performanceByTeam?.filter(perf => perf.eventId === matchId.toString()) || []
      console.log('matchPerformances', matchPerformances)

      // Only proceed if we have real performance data
      if (matchPerformances.length === 0) {
        return null
      }

      // Aggregate player actions for this match
      const aggregatedActions = aggregatePlayerActions(matchPerformances)

      // Get statistical breakdowns
      const offensiveData = getOffensiveData(aggregatedActions)
      const defensiveData = getDefensiveData(aggregatedActions)
      const possessionData = getPossessionData(aggregatedActions)
      const disciplinaryData = getDisciplinaryData(aggregatedActions)

      // Get players who scored goals
      const scoringPlayers: string[] = []

      // Find players who scored in this match
      matchPerformances.forEach(perf => {
        const player = teamData.players?.find(p => p.id === perf.playerId)
        if (!player) return

        // Check if this player has goals
        const playerActions = aggregatePlayerActions([perf])
        const playerOffensiveData = getOffensiveData(playerActions)

        if (playerOffensiveData.totalGoals > 0) {
          scoringPlayers.push(player.firstName + ' ' + player.lastName)
        }
      })

      // Find players with yellow and red cards
      const yellowCardPlayers: string[] = []
      const redCardPlayers: string[] = []

      matchPerformances.forEach(perf => {
        const player = teamData.players?.find(p => p.id === perf.playerId)
        if (!player) return

        // Check for cards
        const playerActions = aggregatePlayerActions([perf])
        const playerDisciplinaryData = getDisciplinaryData(playerActions)

        if (playerDisciplinaryData.totalYellowCards > 0) {
          yellowCardPlayers.push(player.firstName + ' ' + player.lastName)
        }

        if (playerDisciplinaryData.totalRedCards > 0) {
          redCardPlayers.push(player.firstName + ' ' + player.lastName)
        }
      })

      // For xG, we'll estimate based on shots if we don't have real data
      const estimatedXG =
        offensiveData.shotsOnTarget * 0.3 +
        (offensiveData.totalShots - offensiveData.shotsOnTarget) * 0.1

      // Return the match detail
      return {
        ...match,
        details: {
          scorers: scoringPlayers,
          formation: '4-3-3', // Formation might need to come from actual data
          yellowCards: yellowCardPlayers,
          redCards: redCardPlayers,
          corners: possessionData.totalCorners || 0,
          freeKicks: possessionData.totalFreeKicks || 0,
          offsides: possessionData.attemptedTakeOns || 0,
          shotsOnTarget: offensiveData.shotsOnTarget || 0,
          shotsOffTarget: offensiveData.totalShots - offensiveData.shotsOnTarget || 0,
          passAccuracy: Math.round(offensiveData.passAccuracy) || 0,
          clearances: defensiveData.totalClearances || 0,
          foulsCommitted: disciplinaryData.totalFouls || 0,
          foulsReceived: possessionData.totalFoulsReceived || 0,
          xG: parseFloat(estimatedXG.toFixed(1)),
          interceptions: defensiveData.totalInterceptions || 0,
          blocks: defensiveData.totalBlocks || 0,
        },
      }
    },
    [teamData, matchesData],
  )

  // Update match details when selected match changes
  useEffect(() => {
    if (selectedMatch) {
      const details = getMatchDetail(selectedMatch)
      setMatchDetails(details)
    } else {
      setMatchDetails(null)
    }
  }, [selectedMatch, teamData, matchesData, getMatchDetail])

  const handleMatchClick = (matchId: string) => {
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
          {isSelected && (
            <Button
              variant='ghost'
              size='sm'
              className='mt-3 flex w-full items-center justify-center gap-1 text-primary'
              onClick={e => {
                // Prevent the Card's onClick from triggering
                e.stopPropagation()

                // If match details aren't loaded, try to load them
                if (!matchDetails && selectedMatch === match.id) {
                  const details = getMatchDetail(match.id)
                  if (details) {
                    setMatchDetails(details)
                  }
                }

                // If in grid view, switch to list view to show expanded details
                if (viewMode === 'grid') {
                  setViewMode('list')

                  // Give time for the view to change before scrolling
                  setTimeout(() => {
                    const matchRow = document.querySelector(`[data-match-id="${match.id}"]`)
                    if (matchRow) {
                      matchRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  }, 200)
                }
                // If already in list view, just scroll to the expanded details
                else if (viewMode === 'list') {
                  const detailsRow = document.querySelector(`[data-match-details-id="${match.id}"]`)
                  if (detailsRow) {
                    detailsRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  } else {
                    // Fallback to the match row if details row isn't found
                    const matchRow = document.querySelector(`[data-match-id="${match.id}"]`)
                    if (matchRow) {
                      matchRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  }
                }
              }}
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
                    <Fragment key={match.id}>
                      <TableRow
                        className={`cursor-pointer hover:bg-muted/50 ${match.id === selectedMatch ? 'bg-primary/5' : ''}`}
                        onClick={() => handleMatchClick(match.id)}
                        data-match-id={match.id}
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
                      {selectedMatch === match.id && matchDetails && (
                        <TableRow className='bg-muted/30' data-match-details-id={match.id}>
                          <TableCell colSpan={8} className='p-0'>
                            <div className='space-y-4 p-4'>
                              <div className='mb-2 flex items-center justify-between'>
                                <h4 className='flex items-center gap-2 text-lg font-semibold'>
                                  <Flag className='size-4 text-primary' />
                                  Match Details
                                </h4>
                                <Badge>{matchDetails.result}</Badge>
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
                                      {matchDetails.details.scorers.length > 0 ? (
                                        matchDetails.details.scorers.map((scorer, index) => (
                                          <Badge key={index} variant='secondary'>
                                            {scorer}
                                          </Badge>
                                        ))
                                      ) : (
                                        <p className='text-sm text-muted-foreground'>No scorers</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className='mb-4 grid grid-cols-2 gap-4 md:grid-cols-4'>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Formation</p>
                                      <p className='font-medium'>
                                        {matchDetails.details.formation}
                                      </p>
                                    </div>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Cards</p>
                                      <p className='font-medium'>
                                        {matchDetails.details.yellowCards.length}{' '}
                                        <span className='text-amber-500'>●</span>,{' '}
                                        {matchDetails.details.redCards.length}{' '}
                                        <span className='text-red-500'>●</span>
                                      </p>
                                    </div>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Corners</p>
                                      <p className='font-medium'>{matchDetails.details.corners}</p>
                                    </div>
                                    <div>
                                      <p className='text-sm text-muted-foreground'>Free Kicks</p>
                                      <p className='font-medium'>
                                        {matchDetails.details.freeKicks}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Team vs Opponent comparisons */}
                                  <div className='space-y-3'>
                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Possession</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetails.possession}%
                                          </span>
                                        </div>
                                      </div>
                                      <div className='flex h-2 w-full overflow-hidden rounded-full bg-muted'>
                                        <div
                                          className='bg-primary'
                                          style={{ width: `${matchDetails.possession}%` }}
                                        />
                                      </div>
                                    </div>

                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Shots</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetails.shots}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Shots On Target</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetails.details.shotsOnTarget}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className='space-y-1'>
                                      <div className='flex items-center justify-between text-sm'>
                                        <span className='font-medium'>Expected Goals (xG)</span>
                                        <div className='flex gap-2'>
                                          <span className='w-8 text-right font-semibold'>
                                            {matchDetails.details.xG.toFixed(1)}
                                          </span>
                                        </div>
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
                                          {matchDetails.details.passAccuracy}%
                                        </p>
                                        <Progress
                                          value={matchDetails.details.passAccuracy}
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
                                          {matchDetails.details.interceptions}
                                        </p>
                                        <Progress
                                          value={matchDetails.details.interceptions * 6}
                                          className='mt-2 h-1.5'
                                        />
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <div className='mt-4 grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3'>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Corners</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.corners}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Free Kicks</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.freeKicks}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Offsides</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.offsides}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Fouls Committed</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.foulsCommitted}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Fouls Received</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.foulsReceived}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Clearances</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.clearances}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Blocks</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.blocks}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Yellow Cards</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.yellowCards.length}
                                      </span>
                                    </div>
                                    <div className='flex justify-between border-b py-2'>
                                      <span className='text-sm'>Red Cards</span>
                                      <span className='text-sm font-medium'>
                                        {matchDetails.details.redCards.length}
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
                                        {/* Dynamic top performers based on real data */}
                                        <div className='space-y-3'>
                                          {teamData.players && selectedMatch ? (
                                            <>
                                              {getTopPerformers(
                                                selectedMatch.toString(),
                                                teamData,
                                              ).map((player, index) => (
                                                <div
                                                  key={index}
                                                  className='flex items-center border-b pb-2'
                                                >
                                                  <div className='mr-3 flex size-8 items-center justify-center rounded-full bg-primary/10'>
                                                    <span className='text-xs font-medium'>
                                                      {getInitials(player.name)}
                                                    </span>
                                                  </div>
                                                  <div className='flex-1'>
                                                    <p className='text-sm font-medium'>
                                                      {player.name}
                                                    </p>
                                                    <p className='text-xs text-muted-foreground'>
                                                      {getPlayerStats(player)}
                                                    </p>
                                                  </div>
                                                  <div className='rounded-full bg-primary/5 px-2 py-1'>
                                                    <span className='text-xs font-semibold'>
                                                      {player.rating?.toFixed(1) || '-'}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                              {getTopPerformers(selectedMatch.toString(), teamData)
                                                .length === 0 && (
                                                <p className='text-sm text-muted-foreground'>
                                                  No performance data available
                                                </p>
                                              )}
                                            </>
                                          ) : (
                                            <p className='text-sm text-muted-foreground'>
                                              No performance data available
                                            </p>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className='p-4 pb-2'>
                                        <CardTitle className='text-sm'>
                                          Player Contributions
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className='p-4 pt-0'>
                                        <div className='space-y-3'>
                                          {teamData.players && selectedMatch ? (
                                            <>
                                              {getPlayerContributions(
                                                selectedMatch.toString(),
                                                teamData,
                                              ).map((player, index) => (
                                                <div
                                                  key={index}
                                                  className='flex items-center justify-between border-b pb-2'
                                                >
                                                  <div className='flex items-center gap-2'>
                                                    <div className='flex size-7 items-center justify-center rounded-full bg-muted'>
                                                      <span className='text-xs'>{index + 1}</span>
                                                    </div>
                                                    <span className='text-sm'>{player.name}</span>
                                                  </div>
                                                  <span className='text-sm'>
                                                    {player.contribution}
                                                  </span>
                                                </div>
                                              ))}
                                              {getPlayerContributions(
                                                selectedMatch.toString(),
                                                teamData,
                                              ).length === 0 && (
                                                <p className='text-sm text-muted-foreground'>
                                                  No contribution data available
                                                </p>
                                              )}
                                            </>
                                          ) : (
                                            <p className='text-sm text-muted-foreground'>
                                              No contribution data available
                                            </p>
                                          )}
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

                      {/* Debugging message when match is selected but details are null */}
                      {selectedMatch === match.id && !matchDetails && (
                        <TableRow className='bg-muted/30'>
                          <TableCell colSpan={8} className='p-4 text-center'>
                            <div className='space-y-2'>
                              <p className='text-amber-600 dark:text-amber-400'>
                                No detailed performance data available for this match.
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                The system requires real player performance data to display match
                                details.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
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

// Helper function to get player initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Helper function to get formatted player stats
function getPlayerStats(player: {
  goals?: number
  assists?: number
  tackles?: number
  interceptions?: number
  yellowCards?: number
  redCards?: number
}): string {
  const stats = []

  if (player.goals && player.goals > 0) {
    stats.push(`${player.goals} Goal${player.goals > 1 ? 's' : ''}`)
  }

  if (player.assists && player.assists > 0) {
    stats.push(`${player.assists} Assist${player.assists > 1 ? 's' : ''}`)
  }

  if (player.tackles && player.tackles > 0) {
    stats.push(`${player.tackles} Tackle${player.tackles > 1 ? 's' : ''}`)
  }

  if (player.interceptions && player.interceptions > 0) {
    stats.push(`${player.interceptions} Interception${player.interceptions > 1 ? 's' : ''}`)
  }

  if ((player.yellowCards && player.yellowCards > 0) || (player.redCards && player.redCards > 0)) {
    const cards = []
    if (player.yellowCards && player.yellowCards > 0) {
      cards.push(`${player.yellowCards} YC`)
    }
    if (player.redCards && player.redCards > 0) {
      cards.push(`${player.redCards} RC`)
    }
    stats.push(cards.join(', '))
  }

  return stats.join(', ') || 'No significant stats'
}

// Helper function to get top performers for a match
function getTopPerformers(matchId: string, teamData: TeamType) {
  const matchPerformances =
    teamData.performanceByTeam?.filter(perf => perf.eventId === matchId) || []

  // Map performances to players with their stats
  const playerPerformances = matchPerformances
    .map(perf => {
      const player = teamData.players?.find(p => p.id === perf.playerId)
      if (!player) return null

      // Calculate player stats
      const playerActions = aggregatePlayerActions([perf])
      const offensiveData = getOffensiveData(playerActions)
      const defensiveData = getDefensiveData(playerActions)
      const disciplinaryData = getDisciplinaryData(playerActions)

      // Calculate a simple rating based on contributions
      const goals = offensiveData.totalGoals || 0
      const assists = offensiveData.totalAssists || 0
      const tackles = defensiveData.totalTackles || 0
      const interceptions = defensiveData.totalInterceptions || 0
      const yellowCards = disciplinaryData.totalYellowCards || 0
      const redCards = disciplinaryData.totalRedCards || 0

      // Basic rating calculation - can be refined based on position and other factors
      const rating =
        6 +
        goals * 1.5 +
        assists * 1 +
        tackles * 0.2 +
        interceptions * 0.2 -
        yellowCards * 0.5 -
        redCards * 1.5

      return {
        id: player.id,
        name: player.firstName + ' ' + player.lastName,
        goals,
        assists,
        tackles,
        interceptions,
        yellowCards,
        redCards,
        rating: Math.min(10, rating), // Cap at 10
      }
    })
    .filter(p => p !== null) as Array<{
    id: string
    name: string
    goals: number
    assists: number
    tackles: number
    interceptions: number
    yellowCards: number
    redCards: number
    rating: number
  }>

  // Sort by rating and return top 3
  return playerPerformances.sort((a, b) => b.rating - a.rating).slice(0, 3)
}

// Helper function to get player contributions for a match
function getPlayerContributions(matchId: string, teamData: TeamType) {
  const matchPerformances =
    teamData.performanceByTeam?.filter(perf => perf.eventId === matchId) || []

  // Map performances to players with their contribution description
  const playerContributions = matchPerformances
    .map(perf => {
      const player = teamData.players?.find(p => p.id === perf.playerId)
      if (!player) return null

      // Calculate player stats
      const playerActions = aggregatePlayerActions([perf])
      const offensiveData = getOffensiveData(playerActions)
      const defensiveData = getDefensiveData(playerActions)

      // Get main contribution
      let contribution = ''

      if (offensiveData.totalGoals > 0) {
        contribution = `${offensiveData.totalGoals} Goal${offensiveData.totalGoals > 1 ? 's' : ''}`
      } else if (offensiveData.totalAssists > 0) {
        contribution = `${offensiveData.totalAssists} Assist${offensiveData.totalAssists > 1 ? 's' : ''}`
      } else if (defensiveData.totalTackles > 0) {
        contribution = `${defensiveData.totalTackles} Tackle${defensiveData.totalTackles > 1 ? 's' : ''}`
      } else if (defensiveData.totalInterceptions > 0) {
        contribution = `${defensiveData.totalInterceptions} Int.`
      } else if (defensiveData.totalClearances > 0) {
        contribution = `${defensiveData.totalClearances} Clr.`
      } else if (offensiveData.totalPasses > 0) {
        contribution = `${offensiveData.totalPasses} Passes`
      } else {
        contribution = 'Played'
      }

      return {
        id: player.id,
        name: player.firstName + ' ' + player.lastName,
        contribution,
      }
    })
    .filter(p => p !== null) as Array<{
    id: string
    name: string
    contribution: string
  }>

  // Return all player contributions
  return playerContributions
}
