import { ArrowRight, Calendar, CalendarOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Event, TeamResponse } from '@/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useEvents } from '@/hooks/useEvents'
import { cn } from '@/lib/utils'
import { formatSingleEventDate, formatSingleEventTime } from '@/utils/date'
import { combineDateAndTime } from '@/utils/dateObject'
import { SessionInstance } from '@/utils/SessionInstance'

// Get current time in UTC for comparison
const now = new Date().toISOString()

// Function to find upcoming matches
function findUpcomingFixtures(events: Event[] | undefined, limit: number = 3) {
  if (events) {
    return events
      .filter(
        event =>
          event.type === 'match' &&
          new Date(combineDateAndTime(event.date, event.time)) > new Date(now),
      )
      .sort(
        (a, b) =>
          new Date(combineDateAndTime(a.date, a.time)).getTime() -
          new Date(combineDateAndTime(b.date, b.time)).getTime(),
      )
      .slice(0, limit)
  }
  return []
}

// Get avatar text from team name
function getAvatarText(teamName: string): string {
  if (!teamName) return ''

  const words = teamName.split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase()
  } else {
    return words
      .map(word => word[0])
      .join('')
      .substring(0, 3)
      .toUpperCase()
  }
}

interface UpcomingMatchesProps {
  team: TeamResponse | undefined
}

export function UpcomingMatches({ team }: UpcomingMatchesProps) {
  const teamId = SessionInstance.getTeamId()
  const { events } = useEvents(teamId, undefined)
  const upcomingFixtures = findUpcomingFixtures(events)
  const hasMatches = upcomingFixtures.length > 0

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2'>
          <Calendar size={18} className='text-muted-foreground' />
          Upcoming Matches
        </CardTitle>
        <CardDescription>Schedule for the next matches</CardDescription>
      </CardHeader>
      <CardContent className='pb-1'>
        {hasMatches ? (
          <div className='space-y-4'>
            {upcomingFixtures.map(match => {
              // Determine if match is within 48 hours (important)
              const isImportant =
                new Date(combineDateAndTime(match.date, match.time)).getTime() -
                  new Date().getTime() <
                48 * 60 * 60 * 1000

              return (
                <div
                  key={match.id}
                  className={cn(
                    'p-3 rounded-lg border',
                    isImportant ? 'border-primary/20 bg-primary/5' : 'border-border bg-background',
                  )}
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <time className='text-xs font-medium text-muted-foreground'>
                      {formatSingleEventDate(combineDateAndTime(match.date, match.time))} •{' '}
                      {formatSingleEventTime(combineDateAndTime(match.date, match.time))}
                    </time>
                    {isImportant && (
                      <span className='text-xs font-medium text-primary'>Important match</span>
                    )}
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                      <Avatar className='size-8'>
                        <AvatarFallback className='bg-secondary text-xs text-secondary-foreground'>
                          {getAvatarText(team?.teamName || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-sm font-medium'>{team?.teamName}</span>
                    </div>

                    <span className='px-2 text-xs font-medium'>vs</span>

                    <div className='flex items-center gap-1.5'>
                      <span className='text-sm font-medium'>{match.opponent}</span>
                      <Avatar className='size-8'>
                        <AvatarFallback className='bg-secondary text-xs text-secondary-foreground'>
                          {getAvatarText(match.opponent || '')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <div className='mt-2 text-xs text-muted-foreground capitalize'>
                    {match.matchType}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <CalendarOff className='mb-3 size-12 text-muted-foreground opacity-50' />
            <h3 className='mb-1 text-lg font-medium'>No upcoming matches</h3>
            <p className='max-w-xs text-sm text-muted-foreground'>
              There are no scheduled matches in the upcoming period.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className='pt-3'>
        <Button variant='ghost' className='w-full justify-between' asChild>
          <Link to='/events'>
            View all matches
            <ArrowRight size={16} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
