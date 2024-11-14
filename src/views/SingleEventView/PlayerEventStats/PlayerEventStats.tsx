import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { useParams } from 'react-router-dom'
import { FC, useEffect, useMemo, useState } from 'react'
import { Player, TeamResponse } from '@/api'
import { EventsHook } from '@/hooks/useEvents.ts'
import {
  clearPlayerPerformanceData,
  getPerformanceDataByPlayerIdThunk,
  playerPerformanceSelector,
} from '@/store/slices/PlayerPerformanceSlice.ts'
import { useAppDispatch } from '@/store/types.ts'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button.tsx'
import { usePlayer } from '@/hooks/usePlayer.ts'
import ProfileTeamImage from '@/component/ProfileTeamImage/ProfileTeamImage.tsx'
import { calculateAge, formatDate } from '@/services/helper.ts'
import classnames from 'classnames'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import {
  DefensiveMetrics, DisciplineMetric, getHalfData, GoalkeepingMetrics, HalfType,
  OffensiveMetrics,
  PossessionMetrics,
} from '@/utils/phaseMetrics.ts'
import PlayerDataTab from '@/component/PlayerDataTab/PlayerDataTab.tsx'
import { PlayerFieldPosition } from '@/views/SingleEventView/PlayerEventStats/PlayerFieldPosition.tsx'
import ClubLogo from '../../../assets/images/club.png'

type PlayerEventStatsProps = {
  events: EventsHook
  teams: TeamResponse[]
}

export const PlayerEventStats:FC<PlayerEventStatsProps> = ({ events, teams }) => {
  const [selectedHalf, setSelectedHalf] = useState<HalfType>('fullTime')
  const { eventId, playerId, teamId } = useParams()
  const dispatch = useAppDispatch()
  const { playerPerformance } = useSelector(playerPerformanceSelector)
  const { player } = usePlayer(playerId)

  const isEvent = useMemo(() => {
    if (teamId) {
      return events.events.find((event) => event.id === eventId)
    }
  }, [teamId, events, eventId])

  const isTeam = useMemo(() => {
    if (teamId) {
      return teams.find((team) => team.id === teamId)
    }
  }, [teamId, teams])

  useEffect(() => {
    if (eventId && playerId) {
      dispatch(clearPlayerPerformanceData())
      dispatch(getPerformanceDataByPlayerIdThunk({ eventId, playerId }))
    }
  }, [dispatch, eventId, playerId])

  const halfData = getHalfData(playerPerformance, selectedHalf)
  const handleHalfSelection = (half: 'fullTime' | 'firstHalf' | 'secondHalf') => setSelectedHalf(half)

  if(!player) return null

  return (
    <DashboardLayout>
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className='text-sub-text mb-5'>Player Stats</div>
        <div className='flex justify-between items-center pb-5 border-b border-border-line'>
          <ProfileTeamImage playerId={playerId} teamId={teamId}/>
          <Button type='button' className='bg-dark-purple text-white hover:bg-dark-purple'>Export</Button>
        </div>
        <div className='grid grid-cols-3 gap-10 mt-5'>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>AGE</div>
            <div className='text-xs'>{calculateAge(player.birthDate)}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>POSITION</div>
            <div className='text-xs'>{player.position}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>JERSEY NUMBER</div>
            <div className='text-xs'>{player.uniformNumber}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-sub-text text-xs'>MINUTE PLAYED</div>
            <div className='text-xs'>{playerPerformance?.minutePlayed ?? 0}</div>
          </div>
        </div>
      </div>
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className='text-sub-text mb-5'>Match Information</div>
        <div className='grid grid-cols-3 gap-5 items-center justify-center'>
          <div className='col-span-2'>
            <div className='grid grid-cols-3 gap-5 items-center text-center'>
              <div className='flex flex-col items-center'>
                <img src={isTeam?.logo} width={64} alt='team-logo' />
                <div className='mb-5'>{isTeam?.teamName}</div>
              </div>
              <div>vs.</div>
              <div className='flex flex-col items-center'>
                <img src={ClubLogo} width={64} alt='team-logo' />
                <div className='mb-5'>{isEvent?.opponent}</div>
              </div>
            </div>
            <div className='mt-5 text-center'>
              <div>Location: {isEvent?.eventLocation}</div>
              <div>Date: {isEvent && formatDate(isEvent.startDate)}</div>
            </div>
          </div>
          <div className='col-span-1'>
            <PlayerFieldPosition position={player.position} />
          </div>
        </div>
      </div>
      <div className='py-2 px-2.5 mb-5 md:py-10 md:px-12 bg-white rounded-md'>
        <div className='grid justify-end'>
          <div className='bg-card-stat-bg grid grid-cols-3 rounded-md'>
            <div
              className={classnames('p-2.5 cursor-pointer text-text-grey-2 rounded-tl-md rounded-bl-md',
                selectedHalf === 'fullTime' && 'bg-dark-purple' +
                ' text-white')}
              onClick={() => handleHalfSelection('fullTime')}
            >
              Full Time
            </div>
            <div
              className={classnames('p-2.5 cursor-pointer text-text-grey-2',
                selectedHalf === 'firstHalf' && 'bg-dark-purple' +
                ' text-white')}
              onClick={() => handleHalfSelection('firstHalf')}
            >
              1st Half
            </div>
            <div
              className={classnames('p-2.5 cursor-pointer text-text-grey-2 rounded-tr-md rounded-br-md',
                selectedHalf === 'secondHalf' && 'bg-dark-purple' +
                ' text-white')}
              onClick={() => handleHalfSelection('secondHalf')}
            >
              2nd Half
            </div>
          </div>
        </div>
        <div className='my-5'>
          <Tabs defaultValue='offensive'>
            <TabsList className='bg-transparent contents md:grid md:grid-cols-5 gap-3 p-0 mb-5'>
              <TabsTrigger
                value='offensive'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'>Offensive</TabsTrigger>
              <TabsTrigger
                value='defensive'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                Defensive
              </TabsTrigger>
              <TabsTrigger
                value='possession'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                Possession
              </TabsTrigger>
              <TabsTrigger
                value='disciplinary'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                Disciplinary
              </TabsTrigger>
              <TabsTrigger
                value='goalkeeping'
                className='data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple text-text-grey-3 py-2.5 px-3.5 border-b-2 border-transparent'
              >
                Goalkeeping
              </TabsTrigger>
            </TabsList>
            <TabsContent value='offensive' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={OffensiveMetrics} actions={halfData}/>
            </TabsContent>
            <TabsContent value='defensive' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={DefensiveMetrics} actions={halfData}/>
            </TabsContent>
            <TabsContent value='possession' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={PossessionMetrics} actions={halfData}/>
            </TabsContent>
            <TabsContent value='disciplinary' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={DisciplineMetric} actions={halfData}/>
            </TabsContent>
            <TabsContent value='goalkeeping' className='border border-border-line p-6 rounded-lg'>
              <PlayerDataTab metrics={GoalkeepingMetrics} actions={halfData}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
