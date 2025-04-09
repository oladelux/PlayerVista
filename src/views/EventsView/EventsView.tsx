import { useState } from 'react'

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import {
  CalendarDays,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  PlusCircle,
} from 'lucide-react'

import { Event } from '@/api'
import { CreateMatchForm } from '@/component/CreateMatchForm/CreateMatchForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEvents } from '@/hooks/useEvents'
import { combineDateAndTime } from '@/utils/dateObject'
import { SessionInstance } from '@/utils/SessionInstance'

export function EventsView() {
  const teamId = SessionInstance.getTeamId()
  const { events } = useEvents(teamId, undefined)
  const [selectedTab, setSelectedTab] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Filter matches based on selected tab
  const filteredMatches = (() => {
    if (selectedTab === 'all') {
      return events
    } else if (selectedTab === 'upcoming') {
      return events.filter(
        match => new Date(combineDateAndTime(match.date, match.time)) > new Date(),
      )
    } else if (selectedTab === 'completed') {
      return events.filter(
        match => new Date(combineDateAndTime(match.date, match.time)) <= new Date(),
      )
    }
    return events
  })()

  // Handle navigation to match details
  const handleSelectMatch = (match: Event) => {
    console.log(match)
    //navigate(`/matches/${match.id}`)
  }

  // Get matches for a specific day
  const getMatchesForDay = (day: Date) => {
    return filteredMatches.filter(match =>
      isSameDay(combineDateAndTime(match.date, match.time), day),
    )
  }

  // Count stats
  const totalMatches = events.length
  const playedMatches = events.filter(
    match => new Date(combineDateAndTime(match.date, match.time)) < new Date(),
  )
  const upcomingMatches = events.filter(
    match => new Date(combineDateAndTime(match.date, match.time)) > new Date(),
  )

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1))
  }

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1))
  }

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
  }

  // Get days in current month view
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get day name headers (Sun, Mon, etc.)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle size={16} className='mr-2' />
            Create Match
          </Button>
        </DialogTrigger>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[550px]'>
          <DialogHeader>
            <DialogTitle>Create New Match</DialogTitle>
            <DialogDescription>
              Enter the details for the new match. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <CreateMatchForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      {/* Stats overview */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-base font-medium'>
              <CalendarDays size={16} className='text-primary' />
              Total Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{totalMatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-base font-medium'>
              <CheckCircle2 size={16} className='text-green-600' />
              Matches Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{playedMatches.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-base font-medium'>
              <Clock size={16} className='text-blue-600' />
              Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{upcomingMatches.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar tabs and content */}
      <Tabs defaultValue='all' onValueChange={setSelectedTab}>
        <div className='mb-4 flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='all'>All Matches</TabsTrigger>
            <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
            <TabsTrigger value='completed'>Completed</TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardContent className='pt-4'>
            <TabsContent value='all' className='m-0'>
              <div className='calendar-container'>
                {/* Calendar header */}
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-xl font-semibold'>{format(currentDate, 'MMMM yyyy')}</div>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='icon' onClick={handlePrevMonth}>
                      <ChevronLeft className='size-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setCurrentDate(new Date())}
                    >
                      <CalendarIcon className='size-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={handleNextMonth}>
                      <ChevronRight className='size-4' />
                    </Button>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className='grid grid-cols-7 gap-1'>
                  {/* Day names */}
                  {weekDays.map(day => (
                    <div
                      key={day}
                      className='py-2 text-center text-sm font-medium text-muted-foreground'
                    >
                      {day}
                    </div>
                  ))}

                  {/* Day cells */}
                  {daysInMonth.map(day => {
                    const dayMatches = getMatchesForDay(day)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => handleDayClick(day)}
                        className={`
                            h-24 cursor-pointer rounded border p-1 transition-colors
                            ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent'}
                          `}
                      >
                        <div className='p-1 text-right'>
                          <span
                            className={`
                              inline-block size-6 rounded-full text-center text-sm leading-6
                              ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : ''}
                            `}
                          >
                            {format(day, 'd')}
                          </span>
                        </div>

                        {/* Match indicators */}
                        <div className='mt-1 space-y-1'>
                          {dayMatches.slice(0, 2).map(match => (
                            <div
                              key={match.id}
                              className={`
                                  truncate rounded p-1 text-xs
                                  ${new Date(combineDateAndTime(match.date, match.time)) <= new Date() ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                                `}
                            >
                              {format(combineDateAndTime(match.date, match.time), 'HH:mm')}{' '}
                              {match.opponent}
                            </div>
                          ))}
                          {dayMatches.length > 2 && (
                            <div className='text-center text-xs text-muted-foreground'>
                              +{dayMatches.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected day matches */}
              {selectedDate && (
                <div className='mt-6'>
                  <h3 className='mb-2 text-lg font-semibold'>
                    Matches on {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <div className='space-y-2'>
                    {getMatchesForDay(selectedDate).length > 0 ? (
                      getMatchesForDay(selectedDate).map(match => (
                        <Card
                          key={match.id}
                          className='cursor-pointer hover:bg-accent/50'
                          onClick={() => handleSelectMatch(match)}
                        >
                          <CardContent className='p-4'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`h-8 w-2 rounded-sm ${new Date(combineDateAndTime(match.date, match.time)) <= new Date() ? 'bg-green-500' : 'bg-blue-500'}`}
                                ></div>
                                <div>
                                  <h4 className='font-medium'>{match.opponent}</h4>
                                  <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                    <Clock className='size-3' />
                                    {format(combineDateAndTime(match.date, match.time), 'HH:mm')}
                                    <span className='mx-1'>•</span>
                                    <MapPin className='size-3' />
                                    <span className='capitalize'>{match.location}</span>
                                  </div>
                                </div>
                              </div>
                              {new Date(combineDateAndTime(match.date, match.time)) <= new Date() &&
                                match.homeScore &&
                                match.awayScore && (
                                  <div className='flex items-center gap-1.5'>
                                    <CheckCircle2 size={16} className='text-green-600' />
                                    <span className='font-medium'>
                                      {match.homeScore} - {match.awayScore}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className='py-6 text-center text-muted-foreground'>
                        No matches on this day.
                        <div className='mt-2'>
                          <Button variant='outline' onClick={() => setIsCreateDialogOpen(true)}>
                            <PlusCircle size={16} className='mr-2' />
                            Add Match
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value='upcoming' className='m-0'>
              {/* Use the same calendar implementation for upcoming matches tab */}
              <div className='calendar-container'>
                {/* Calendar header */}
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-xl font-semibold'>{format(currentDate, 'MMMM yyyy')}</div>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='icon' onClick={handlePrevMonth}>
                      <ChevronLeft className='size-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setCurrentDate(new Date())}
                    >
                      <CalendarIcon className='size-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={handleNextMonth}>
                      <ChevronRight className='size-4' />
                    </Button>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className='grid grid-cols-7 gap-1'>
                  {/* Day names */}
                  {weekDays.map(day => (
                    <div
                      key={day}
                      className='py-2 text-center text-sm font-medium text-muted-foreground'
                    >
                      {day}
                    </div>
                  ))}

                  {/* Day cells */}
                  {daysInMonth.map(day => {
                    const dayMatches = getMatchesForDay(day)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => handleDayClick(day)}
                        className={`
                            h-24 cursor-pointer rounded border p-1 transition-colors
                            ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent'}
                          `}
                      >
                        <div className='p-1 text-right'>
                          <span
                            className={`
                              inline-block size-6 rounded-full text-center text-sm leading-6
                              ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : ''}
                            `}
                          >
                            {format(day, 'd')}
                          </span>
                        </div>

                        {/* Match indicators */}
                        <div className='mt-1 space-y-1'>
                          {dayMatches.slice(0, 2).map(match => (
                            <div
                              key={match.id}
                              className={`
                                  truncate rounded p-1 text-xs
                                  ${new Date(combineDateAndTime(match.date, match.time)) <= new Date() ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                                `}
                            >
                              {format(combineDateAndTime(match.date, match.time), 'HH:mm')}{' '}
                              {match.opponent}
                            </div>
                          ))}
                          {dayMatches.length > 2 && (
                            <div className='text-center text-xs text-muted-foreground'>
                              +{dayMatches.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected day matches */}
              {selectedDate && (
                <div className='mt-6'>
                  <h3 className='mb-2 text-lg font-semibold'>
                    Matches on {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <div className='space-y-2'>
                    {getMatchesForDay(selectedDate).length > 0 ? (
                      getMatchesForDay(selectedDate).map(match => (
                        <Card
                          key={match.id}
                          className='cursor-pointer hover:bg-accent/50'
                          onClick={() => handleSelectMatch(match)}
                        >
                          <CardContent className='p-4'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`h-8 w-2 rounded-sm ${new Date(combineDateAndTime(match.date, match.time)) <= new Date() ? 'bg-green-500' : 'bg-blue-500'}`}
                                ></div>
                                <div>
                                  <h4 className='font-medium'>{match.opponent}</h4>
                                  <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                    <Clock className='size-3' />
                                    {format(combineDateAndTime(match.date, match.time), 'HH:mm')}
                                    <span className='mx-1'>•</span>
                                    <MapPin className='size-3' />
                                    {match.location}
                                  </div>
                                </div>
                              </div>
                              {new Date(combineDateAndTime(match.date, match.time)) <= new Date() &&
                                match.homeScore &&
                                match.awayScore && (
                                  <div className='flex items-center gap-1.5'>
                                    <CheckCircle2 size={16} className='text-green-600' />
                                    <span className='font-medium'>
                                      {match.homeScore} - {match.awayScore}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className='py-6 text-center text-muted-foreground'>
                        No matches on this day.
                        <div className='mt-2'>
                          <Button variant='outline' onClick={() => setIsCreateDialogOpen(true)}>
                            <PlusCircle size={16} className='mr-2' />
                            Add Match
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value='completed' className='m-0'>
              {/* Use the same calendar implementation for completed matches tab */}
              <div className='calendar-container'>
                {/* Calendar header */}
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-xl font-semibold'>{format(currentDate, 'MMMM yyyy')}</div>
                  <div className='flex gap-2'>
                    <Button variant='outline' size='icon' onClick={handlePrevMonth}>
                      <ChevronLeft className='size-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setCurrentDate(new Date())}
                    >
                      <CalendarIcon className='size-4' />
                    </Button>
                    <Button variant='outline' size='icon' onClick={handleNextMonth}>
                      <ChevronRight className='size-4' />
                    </Button>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className='grid grid-cols-7 gap-1'>
                  {/* Day names */}
                  {weekDays.map(day => (
                    <div
                      key={day}
                      className='py-2 text-center text-sm font-medium text-muted-foreground'
                    >
                      {day}
                    </div>
                  ))}

                  {/* Day cells */}
                  {daysInMonth.map(day => {
                    const dayMatches = getMatchesForDay(day)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => handleDayClick(day)}
                        className={`
                            h-24 cursor-pointer rounded border p-1 transition-colors
                            ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent'}
                          `}
                      >
                        <div className='p-1 text-right'>
                          <span
                            className={`
                              inline-block size-6 rounded-full text-center text-sm leading-6
                              ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : ''}
                            `}
                          >
                            {format(day, 'd')}
                          </span>
                        </div>

                        {/* Match indicators */}
                        <div className='mt-1 space-y-1'>
                          {dayMatches.slice(0, 2).map(match => (
                            <div
                              key={match.id}
                              className={`
                                  truncate rounded p-1 text-xs
                                  ${new Date(combineDateAndTime(match.date, match.time)) <= new Date() ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                                `}
                            >
                              {format(combineDateAndTime(match.date, match.time), 'HH:mm')}{' '}
                              {match.opponent}
                            </div>
                          ))}
                          {dayMatches.length > 2 && (
                            <div className='text-center text-xs text-muted-foreground'>
                              +{dayMatches.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected day matches */}
              {selectedDate && (
                <div className='mt-6'>
                  <h3 className='mb-2 text-lg font-semibold'>
                    Matches on {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <div className='space-y-2'>
                    {getMatchesForDay(selectedDate).length > 0 ? (
                      getMatchesForDay(selectedDate).map(match => (
                        <Card
                          key={match.id}
                          className='cursor-pointer hover:bg-accent/50'
                          onClick={() => handleSelectMatch(match)}
                        >
                          <CardContent className='p-4'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`h-8 w-2 rounded-sm ${new Date(combineDateAndTime(match.date, match.time)) <= new Date() ? 'bg-green-500' : 'bg-blue-500'}`}
                                ></div>
                                <div>
                                  <h4 className='font-medium'>{match.opponent}</h4>
                                  <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                    <Clock className='size-3' />
                                    {format(combineDateAndTime(match.date, match.time), 'HH:mm')}
                                    <span className='mx-1'>•</span>
                                    <MapPin className='size-3' />
                                    {match.location}
                                  </div>
                                </div>
                              </div>
                              {new Date(combineDateAndTime(match.date, match.time)) <= new Date() &&
                                match.homeScore &&
                                match.awayScore && (
                                  <div className='flex items-center gap-1.5'>
                                    <CheckCircle2 size={16} className='text-green-600' />
                                    <span className='font-medium'>
                                      {match.homeScore} - {match.awayScore}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className='py-6 text-center text-muted-foreground'>
                        No matches on this day.
                        <div className='mt-2'>
                          <Button variant='outline' onClick={() => setIsCreateDialogOpen(true)}>
                            <PlusCircle size={16} className='mr-2' />
                            Add Match
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
