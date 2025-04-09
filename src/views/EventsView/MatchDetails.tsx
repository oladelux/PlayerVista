import { format } from 'date-fns'
import {
  Award,
  BarChart2,
  Calendar,
  Clock, // Replacing Whistle with Award
  Flag,
  MapPin,
  Share2,
  Trophy,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils' // Import the cn utility function

// Mock data for a completed match
const matchData = {
  id: 1,
  homeTeam: {
    id: 1,
    name: 'Manchester United',
    logoText: 'MU',
    score: 2,
    possession: 52,
    shots: 14,
    shotsOnTarget: 5,
    passes: 423,
    fouls: 8,
    yellowCards: 2,
    redCards: 0,
    goalScorers: [
      { name: 'Bruno Fernandes', minute: 32 },
      { name: 'Marcus Rashford', minute: 78 },
    ],
  },
  awayTeam: {
    id: 2,
    name: 'Liverpool',
    logoText: 'LIV',
    score: 1,
    possession: 48,
    shots: 12,
    shotsOnTarget: 3,
    passes: 389,
    fouls: 10,
    yellowCards: 3,
    redCards: 0,
    goalScorers: [{ name: 'Mohamed Salah', minute: 45 }],
  },
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  time: '15:00',
  competition: 'Premier League',
  location: 'Old Trafford',
  referee: 'Michael Oliver',
  attendance: '74,140',
  status: 'completed',
  matchStats: [
    { name: 'Possession', home: 52, away: 48 },
    { name: 'Shots', home: 14, away: 12 },
    { name: 'Shots on Target', home: 5, away: 3 },
    { name: 'Corners', home: 6, away: 4 },
    { name: 'Fouls', home: 8, away: 10 },
    { name: 'Yellow Cards', home: 2, away: 3 },
    { name: 'Red Cards', home: 0, away: 0 },
    { name: 'Passes', home: 423, away: 389 },
    { name: 'Pass Accuracy', home: 87, away: 84 },
  ],
  highlights: [
    { minute: 32, description: 'GOAL! Bruno Fernandes scores for Manchester United', team: 'home' },
    { minute: 45, description: 'GOAL! Mohamed Salah equalizes for Liverpool', team: 'away' },
    { minute: 56, description: 'Yellow card for Henderson (Liverpool)', team: 'away' },
    { minute: 78, description: 'GOAL! Marcus Rashford puts Manchester United ahead', team: 'home' },
    { minute: 90, description: 'Four minutes of added time', team: 'neither' },
  ],
}

export function MatchDetails() {
  const { toast } = useToast()
  const match = matchData

  const handleShare = () => {
    toast({
      title: 'Match link copied to clipboard!',
    })
  }

  const formatMatchDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy')
  }

  return (
    <>
      <div className='flex gap-2'>
        <Button variant='outline' size='sm' onClick={handleShare}>
          <Share2 size={16} className='mr-2' />
          Share
        </Button>
        {/* <ExportPdfButton
          options={{
            title: `Match Report: ${match.homeTeam.name} vs ${match.awayTeam.name}`,
            content: `Comprehensive match report for ${match.homeTeam.name} vs ${match.awayTeam.name} played on ${formatMatchDate(match.date)}.`,
            exportType: 'team-match',
          }}
          variant='outline'
          size='sm'
          customLabel='Export Report'
        /> */}
      </div>

      <div className='space-y-6 p-4 md:p-6'>
        {/* Match Result Card */}
        <Card className='shadow-md'>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 items-center gap-4 lg:grid-cols-7'>
              {/* Home Team */}
              <div className='col-span-3 flex flex-col items-center text-center lg:items-end lg:text-right'>
                <Avatar className='mb-2 size-16'>
                  <AvatarFallback className='bg-primary text-lg font-bold text-primary-foreground'>
                    {match.homeTeam.logoText}
                  </AvatarFallback>
                </Avatar>
                <h3 className='text-xl font-bold'>{match.homeTeam.name}</h3>
              </div>

              {/* Score */}
              <div className='col-span-1 flex flex-col items-center justify-center'>
                <div className='flex items-center text-4xl font-bold'>
                  <span>{match.homeTeam.score}</span>
                  <span className='mx-2'>-</span>
                  <span>{match.awayTeam.score}</span>
                </div>
                <Badge variant='outline' className='mt-2'>
                  {match.status === 'completed' ? 'Full Time' : 'Upcoming'}
                </Badge>
              </div>

              {/* Away Team */}
              <div className='col-span-3 flex flex-col items-center text-center lg:items-start lg:text-left'>
                <Avatar className='mb-2 size-16'>
                  <AvatarFallback className='bg-secondary text-lg font-bold text-secondary-foreground'>
                    {match.awayTeam.logoText}
                  </AvatarFallback>
                </Avatar>
                <h3 className='text-xl font-bold'>{match.awayTeam.name}</h3>
              </div>
            </div>

            {/* Match Info */}
            <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-4'>
              <div className='flex items-center'>
                <Calendar size={18} className='mr-2 text-muted-foreground' />
                <span>{formatMatchDate(match.date)}</span>
              </div>
              <div className='flex items-center'>
                <Clock size={18} className='mr-2 text-muted-foreground' />
                <span>{match.time}</span>
              </div>
              <div className='flex items-center'>
                <MapPin size={18} className='mr-2 text-muted-foreground' />
                <span>{match.location}</span>
              </div>
              <div className='flex items-center'>
                <Trophy size={18} className='mr-2 text-muted-foreground' />
                <span>{match.competition}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Details Tabs */}
        <Tabs defaultValue='stats'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='stats'>Match Stats</TabsTrigger>
            <TabsTrigger value='timeline'>Timeline</TabsTrigger>
            <TabsTrigger value='info'>Match Info</TabsTrigger>
          </TabsList>

          {/* Match Stats */}
          <TabsContent value='stats' className='mt-4 space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center text-xl'>
                  <BarChart2 size={18} className='mr-2 text-primary' />
                  Match Statistics
                </CardTitle>
                <CardDescription>Performance comparison between the teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {match.matchStats.map((stat, index) => (
                    <div key={index} className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='font-medium'>{stat.home}</span>
                        <span className='text-muted-foreground'>{stat.name}</span>
                        <span className='font-medium'>{stat.away}</span>
                      </div>
                      <div className='flex h-2 items-center'>
                        <div
                          className='h-2 rounded-l-full bg-primary'
                          style={{ width: `${stat.home}%` }}
                        />
                        <div
                          className='h-2 rounded-r-full bg-secondary'
                          style={{ width: `${stat.away}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goal Scorers */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>{match.homeTeam.name} Scorers</CardTitle>
                </CardHeader>
                <CardContent>
                  {match.homeTeam.goalScorers.length > 0 ? (
                    <ul className='space-y-2'>
                      {match.homeTeam.goalScorers.map((scorer, index) => (
                        <li key={index} className='flex items-center justify-between'>
                          <span>{scorer.name}</span>
                          <Badge variant='outline'>{scorer.minute}'</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-muted-foreground'>No goals scored</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg'>{match.awayTeam.name} Scorers</CardTitle>
                </CardHeader>
                <CardContent>
                  {match.awayTeam.goalScorers.length > 0 ? (
                    <ul className='space-y-2'>
                      {match.awayTeam.goalScorers.map((scorer, index) => (
                        <li key={index} className='flex items-center justify-between'>
                          <span>{scorer.name}</span>
                          <Badge variant='outline'>{scorer.minute}'</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-muted-foreground'>No goals scored</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value='timeline' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center text-xl'>
                  <Clock size={18} className='mr-2 text-primary' />
                  Match Timeline
                </CardTitle>
                <CardDescription>Key moments from the match</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='relative ml-4 space-y-6 border-l-2 border-muted py-2 pl-6'>
                  {match.highlights.map((highlight, index) => (
                    <div key={index} className='relative'>
                      <div className='absolute -left-[29px] mt-1.5 size-3 rounded-full bg-primary' />
                      <div className='flex items-start'>
                        <Badge variant='outline' className='mr-3'>
                          {highlight.minute}'
                        </Badge>
                        <p
                          className={cn(
                            'flex-1',
                            highlight.team === 'home'
                              ? 'text-primary'
                              : highlight.team === 'away'
                                ? 'text-secondary'
                                : '',
                          )}
                        >
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Match Info */}
          <TabsContent value='info' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center text-xl'>
                  <Trophy size={18} className='mr-2 text-primary' />
                  Match Information
                </CardTitle>
                <CardDescription>Details about the match venue and officials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div>
                      <h4 className='mb-1 text-sm font-medium text-muted-foreground'>
                        Competition
                      </h4>
                      <p className='text-base'>{match.competition}</p>
                    </div>
                    <div>
                      <h4 className='mb-1 text-sm font-medium text-muted-foreground'>Venue</h4>
                      <p className='text-base'>{match.location}</p>
                    </div>
                    <div>
                      <h4 className='mb-1 text-sm font-medium text-muted-foreground'>
                        Date & Time
                      </h4>
                      <p className='text-base'>
                        {formatMatchDate(match.date)} at {match.time}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <h4 className='mb-1 text-sm font-medium text-muted-foreground'>Referee</h4>
                      <div className='flex items-center'>
                        <Award size={16} className='mr-2 text-muted-foreground' />
                        <p className='text-base'>{match.referee}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className='mb-1 text-sm font-medium text-muted-foreground'>Attendance</h4>
                      <div className='flex items-center'>
                        <Users size={16} className='mr-2 text-muted-foreground' />
                        <p className='text-base'>{match.attendance}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className='mb-1 text-sm font-medium text-muted-foreground'>Status</h4>
                      <div className='flex items-center'>
                        <Flag size={16} className='mr-2 text-muted-foreground' />
                        <p className='text-base capitalize'>{match.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
