import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Player, PlayerActions, TeamResult } from '@/api'
import { getPerformanceDataThunk, playerPerformanceSelector } from '@/store/slices/PlayerPerformanceSlice.ts'
import { useAppDispatch } from '@/store/types.ts'
import { EventsHook } from '@/hooks/useEvents.ts'
import { convertSecondsToGameMinute, getPlayerActions } from '@/utils/players.ts'

import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { TabButton } from '@/component/TabButton/TabButton.tsx'
import { TabContent } from '@/component/TabContent/TabContent.tsx'
import { PlayerSummaryStats } from './PlayerSummaryStats/PlayerSummaryStats.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Slider } from '@/components/ui/slider.tsx'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'

import ClubLogo from '../../../assets/images/club.png'

import './EventSummary.scss'

const tabCategory = ['Player Stats']
type GeneralActionType = 'pass' | 'tackles' | 'shots' | 'aerial_duels';

type EventSummaryProps = {
  players: Player[]
  events: EventsHook
  teams: TeamResult[]
}

export const EventSummary:FC<EventSummaryProps> = ({ players, events, teams }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [value, setValue] = useState('general')
  const [timeRange, setTimeRange] = useState<number[]>([0, 90])
  const { teamId, eventId } = useParams()
  const dispatch = useAppDispatch()
  const { performance } = useSelector(playerPerformanceSelector)

  const activeCategory = selectedCategory || tabCategory[0]

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

  const data = getPlayerActions(players, performance)
  useEffect(() => {
    if(eventId) {
      dispatch(getPerformanceDataThunk({ eventId }))
    }
  }, [dispatch, eventId])

  const renderPlayerActions = (actions: PlayerActions | undefined) => {
    const actionTypes: GeneralActionType[] = ['pass', 'tackles', 'shots', 'aerial_duels']
    if (!actions) {
      return actionTypes.map((type) => (
        <Fragment key={type}>
          <TableCell className='text-center border-r' key={`${type}-total`}>0</TableCell>
          <TableCell className='text-center border-r' key={`${type}-successful`}>0</TableCell>
        </Fragment>
      ))
    }
    return actionTypes.map((type) => {
      const filteredActions = actions[type].filter(action =>
        action.timestamp >= timeRange[0] && action.timestamp <= timeRange[1],
      )
      return (
        <Fragment key={type}>
          <TableCell className='text-center border-r'>
            {filteredActions.length ?? 0}
          </TableCell>
          <TableCell className='text-center border-r'>
            {filteredActions.filter((action) => action.value === 'SUCCESSFUL').length ?? 0}
          </TableCell>
        </Fragment>
      )
    })
  }

  const getPlayerDataById =
    (id: string): { actions: PlayerActions | undefined, minutePlayed: number } | undefined => {
      const playerData = data.find((player) => player.playerId === id)
      if(playerData){
        return { actions: playerData.actions, minutePlayed: playerData.minutePlayed }
      }
      return undefined
    }
  console.log('timeRange', timeRange)
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
                <SelectItem value='setpieces'>Set Pieces</SelectItem>
              </SelectContent>
            </Select>
            <div className='my-8' >
              <div className='mb-4'>Time</div>
              <Slider value={timeRange} min={0} max={90} step={1}
                minStepsBetweenThumbs={1} onValueChange={(value) => setTimeRange(value)}
              />
            </div>
            <div className='my-2'>
              <Table>
                <TableCaption>{players.length} Players</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='border-r'>No.</TableHead>
                    <TableHead className='border-r'>Pos.</TableHead>
                    <TableHead className='border-r'>Mins.</TableHead>
                    <TableHead className='border-r'>Name</TableHead>
                    <TableHead colSpan={2} className='text-center border-r'>Passes</TableHead>
                    <TableHead colSpan={2} className='text-center border-r'>Tackles</TableHead>
                    <TableHead colSpan={2} className='text-center border-r'>Shooting</TableHead>
                    <TableHead colSpan={2} className='text-center'>Aerial Duels</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className='border-r'></TableHead>
                    <TableHead className='border-r'></TableHead>
                    <TableHead className='border-r'></TableHead>
                    <TableHead className='border-r'></TableHead>
                    <TableHead className='text-center border-r' title='Attempted Passes'>ATT</TableHead>
                    <TableHead className='text-center border-r' title='Completed Passes'>CMP</TableHead>
                    <TableHead className='text-center border-r' title='Attempted Tackles'>ATT</TableHead>
                    <TableHead className='text-center border-r' title='Completed Tackles'>CMP</TableHead>
                    <TableHead className='text-center border-r' title='On Target'>ON</TableHead>
                    <TableHead className='text-center border-r' title='Off Target'>OFF</TableHead>
                    <TableHead className='text-center border-r' title='Attempted Duels'>ATT</TableHead>
                    <TableHead className='text-center' title='Completed Duels'>CMP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map(player => {
                    const matchData = getPlayerDataById(player.id)
                    console.log('matchData', matchData)
                    return (
                      <TableRow key={`${player.firstName}-${player.id}`}>
                        <TableCell className='border-r'>{player.uniformNumber}</TableCell>
                        <TableCell className='border-r'>{player.position}</TableCell>
                        <TableCell className='border-r'>{matchData?.minutePlayed ?
                          convertSecondsToGameMinute(matchData.minutePlayed) : 0}
                        </TableCell>
                        <TableCell className='border-r'>{`${player.firstName} ${player.lastName}`}</TableCell>
                        {renderPlayerActions(matchData?.actions)}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

            </div>
          </div>
          <div className='Event-summary__content-tab'>
            {tabCategory.map(category =>
              <TabButton
                className='Event-summary__content-tab-category'
                key={category}
                isActive={activeCategory === category}
                onClick={() => setSelectedCategory(category)}>{category}
              </TabButton>,
            )}
          </div>
          <div className='Event-summary__content-section'>
            {tabCategory.map(category =>
              <TabContent key={category} isActive={activeCategory === category}>
                {/*{category === 'Summary' && <SummaryContent />}*/}
                {category === 'Player Stats' && <PlayerSummaryStats players={players} />}
              </TabContent>,
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
