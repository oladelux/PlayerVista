import { FC, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import AwayIcon from '../../assets/images/icons/away.svg'
import HomeIcon from '../../assets/images/icons/home.svg'
import { Event } from '@/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import './StatisticsView.scss'
import { useEvents } from '@/hooks/useEvents.ts'
import { formatSingleEventDate } from '@/utils/date'

const currentYearValue = new Date().getFullYear()

export function StatisticsView() {
  const { teamId } = useParams()
  const event = useEvents(teamId, undefined)
  const teamEvent = event.getTeamEvent
  const [selectedEvent, setSelectedEvent] = useState<Event[]>([])
  const [currentSelectedYear, setCurrentSelectedYear] = useState<number>(currentYearValue)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const handleYearChange = (selectedYear: string) => {
    setCurrentSelectedYear(parseInt(selectedYear))
  }

  useEffect(() => {
    const getCurrentEventBYYear = teamEvent(currentSelectedYear)
    setSelectedEvent(getCurrentEventBYYear)
  }, [currentSelectedYear, teamEvent])

  //Sort events by date
  const sortedEvents = selectedEvent.sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  return (
    <div className='Statistics-view'>
      <Select
        onValueChange={handleYearChange}
        defaultValue={currentSelectedYear.toString()}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Year' />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className='mt-5 flex flex-col gap-5'>
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) =>
            teamId && (<EventCard key={event.id} event={event} teamId={teamId}/>),
          )
        ) : (
          <p>No events found for this year.</p>
        )}
      </div>
    </div>
  )
}

interface EventCardProps {
  event: Event;
  teamId: string;
}

const EventCard: FC<EventCardProps> = ({ event, teamId }) => {
  return (
    <div className='Event-card flex h-20 items-center justify-between rounded-lg border px-2 md:px-5'>
      <div className='w-1/5 text-sm'>
        {formatSingleEventDate(event.startDate)}
      </div>
      <div className='w-1/4 font-medium'>vs. {event.opponent}</div>
      <div className='rounded-lg bg-[#37003c] p-2 ' title={event.location.toUpperCase()}>
        {event.location === 'home' ? (
          <img src={HomeIcon} width={20} alt='home-icon'/>
        ) : (
          <img src={AwayIcon} width={20} alt='awayicon' />
        )}
      </div>
      <Link
        className='border-b border-[#37003c] text-sm'
        to={`/${teamId}/statistics/${event.id}`}
      >
        View Stats
      </Link>
    </div>
  )
}
