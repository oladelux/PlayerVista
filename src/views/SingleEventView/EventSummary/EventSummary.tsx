import { FC, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Player, TeamResult } from '@/api'
import { EventsHook } from '@/hooks/useEvents.ts'

import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'

import ClubLogo from '../../../assets/images/club.png'

import './EventSummary.scss'
import { GeneralStats } from '@/views/SingleEventView/EventSummary/stats/GeneralStats.tsx'
import { GoalKeeperStats } from '@/views/SingleEventView/EventSummary/stats/GoalKeeperStats.tsx'
import { DefendingStats } from '@/views/SingleEventView/EventSummary/stats/DefendingStats.tsx'
import { AttackingStats } from '@/views/SingleEventView/EventSummary/stats/AttackingStats.tsx'
import { OtherStats } from '@/views/SingleEventView/EventSummary/stats/OtherStats.tsx'

type EventSummaryProps = {
  players: Player[]
  events: EventsHook
  teams: TeamResult[]
}

export const EventSummary:FC<EventSummaryProps> = ({ players, events, teams }) => {
  //const [selectedCategory, setSelectedCategory] = useState('')
  const [value, setValue] = useState('general')
  const { teamId, eventId } = useParams()

  //const activeCategory = selectedCategory || tabCategory[0]

  const isEvent = useMemo(() => {
    if(teamId) {
      return events.events && events.events.find(event => event.id === eventId)
    }
  }, [teamId, events, eventId])

  const isTeam = useMemo(() => {
    if(teams) {
      return teams.find(team => team.id === teamId)
    }
  }, [teamId, teams])


  return (
    <DashboardLayout>
      <div className='Event-summary'>
        <div className='Event-summary__header'>
          <div className='Event-summary__header-home'>
            <div className='Event-summary__header-home--media'>
              <img src={isTeam?.logo} width={64} alt='club-logo' />
            </div>
            <div className='Event-summary__header-home--name'>
              {isTeam?.teamName}
            </div>
          </div>
          <div className='Event-summary__header-score'>
            vs
          </div>
          <div className='Event-summary__header-away'>
            <div className='Event-summary__header-away--name'>
              {isEvent?.opponent}
            </div>
            <div className='Event-summary__header-away--media'>
              <img src={ClubLogo} alt='club-logo'/>
            </div>
          </div>
        </div>
        <div className='Event-summary__content'>
          <div className='bg-white p-4 mb-8'>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue defaultValue={value} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='general'>General Info</SelectItem>
                <SelectItem value='goalkeeping'>Goalkeeping</SelectItem>
                <SelectItem value='defending'>Defending</SelectItem>
                <SelectItem value='attacking'>Attacking</SelectItem>
                <SelectItem value='otherstats'>Other Stats</SelectItem>
              </SelectContent>
            </Select>
            {value === 'general' && <GeneralStats players={players} />}
            {value === 'goalkeeping' && <GoalKeeperStats players={players} />}
            {value === 'defending' && <DefendingStats players={players} />}
            {value === 'attacking' && <AttackingStats players={players} />}
            {value === 'otherstats' && <OtherStats players={players} />}
          </div>
          {/*<div className='Event-summary__content-tab'>
            {tabCategory.map(category =>
              <TabButton
                className='Event-summary__content-tab-category'
                key={category}
                isActive={activeCategory === category}
                onClick={() => setSelectedCategory(category)}>{category}
              </TabButton>,
            )}
          </div>*/}
          {/*<div className='Event-summary__content-section'>
            {tabCategory.map(category =>
              <TabContent key={category} isActive={activeCategory === category}>
                {category === 'Summary' && <SummaryContent />}
                {category === 'Player Stats' && <PlayerSummaryStats players={players} />}
              </TabContent>,
            )}
          </div>*/}
        </div>
      </div>
    </DashboardLayout>
  )
}
