import { FC, useEffect, useState } from 'react'
import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Event } from '@/api'
import { Link, useParams } from 'react-router-dom'
import HomeIcon from '../../assets/images/icons/home.svg'
import AwayIcon from '../../assets/images/icons/away.svg'

import './StatisticsView.scss'
import { formatSingleEventDate } from '@/utils/date'

interface StatisticsViewProps {
  teamEvent: (year: number) => Event[]
}
const currentYearValue = new Date().getFullYear()

export const StatisticsView: FC<StatisticsViewProps> = ({ teamEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event[]>([])
  const [currentSelectedYear, setCurrentSelectedYear] = useState<number>(currentYearValue)
  const { teamId } = useParams()

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
    <DashboardLayout>
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
    </DashboardLayout>
  )
}

interface EventCardProps {
  event: Event;
  teamId: string;
}

const EventCard: FC<EventCardProps> = ({ event, teamId }) => {
  return (
    <div className='Event-card h-20 flex items-center justify-between px-2 md:px-5 border rounded-lg'>
      <div className='w-1/5 text-sm'>
        {formatSingleEventDate(event.startDate)}
      </div>
      <div className='w-1/4 font-medium'>vs. {event.opponent}</div>
      <div className='bg-[#37003c] rounded-lg p-2 ' title={event.location.toUpperCase()}>
        {event.location === 'home' ? (
          <img src={HomeIcon} width={20} alt='home-icon'/>
        ) : (
          <img src={AwayIcon} width={20} alt='awayicon' />
        )}
      </div>
      <Link
        className='border-b border-[#37003c] text-sm'
        to={`/team/${teamId}/statistics/${event.id}`}
      >
        View Stats
      </Link>
    </div>
  )
}
