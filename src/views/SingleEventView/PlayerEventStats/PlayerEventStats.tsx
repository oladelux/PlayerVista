import { DashboardLayout } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { useParams } from 'react-router-dom'
import { FC, useEffect, useMemo } from 'react'
import { Action, Player, PlayerActions, TeamResult } from '@/api'
import { EventsHook } from '@/hooks/useEvents.ts'
import { PlayerFieldPosition } from '@/views/SingleEventView/PlayerEventStats/PlayerFieldPosition.tsx'
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from '@/components/ui/table.tsx'
import { getPerformanceDataThunk, playerPerformanceSelector } from '@/store/slices/PlayerPerformanceSlice.ts'
import { useAppDispatch } from '@/store/types.ts'
import { useSelector } from 'react-redux'
import { getPlayerActionsForSinglePlayer } from '@/utils/players.ts'
import { Progress } from '@/components/ui/progress.tsx'
import { Button } from '@/component/Button/Button.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FiDownload } from 'react-icons/fi'
import { calculateAge } from '@/services/helper.ts'
import { NumberStatCard } from '@/component/NumberStatCard/NumberStatCard.tsx';
import { IndividualStatCard } from '@/component/IndividualStatCard/IndividualStatCard.tsx';
import { FirstHalfStats } from '@/views/SingleEventView/PlayerEventStats/FirstHalfStats.tsx';

type PlayerEventStatsProps = {
  players: Player[]
  events: EventsHook
  teams: TeamResult[]
}

const getStatTitle = (type: string) => {
  switch (type) {
    case 'pass':
      return 'Passes Attempted/Completed'
    case 'tackles':
      return 'Tackling Attempted/completed'
    case 'aerial_duels':
      return 'Aerial Duel Attempted/Won'
    case 'goals':
      return 'Goals'
    case 'shots':
      return 'Total Shots/On Target'
    case 'assists':
      return 'Assists'
    case 'interceptions':
      return 'Interceptions'
    case 'clearance':
      return 'Clearance'
    case 'touch':
      return 'Touches'
    case 'blocked_shots':
      return 'Blocked Shots'
    case 'duels':
      return 'Duels/Won'
    case 'fouls':
      return 'Fouls'
    default:
      return type
  }
}
const statsTypes = ['shots', 'tackles', 'pass', 'goals', 'assists', 'interceptions',
  'clearance', 'touch', 'blocked_shots', 'aerial_duels', 'fouls', 'duels']
const isValidActionType = (type: string): type is keyof PlayerActions => {
  return [
    'shots', 'tackles', 'goals', 'pass', 'assists', 'interceptions', 'clearance',
    'blocked_shots', 'aerial_duels', 'aerial_clearance', 'fouls', 'saves',
    'mistakes', 'recoveries', 'blocks', 'yellow_cards', 'red_cards', 'offside',
    'corner_kick', 'freekick', 'dribble', 'penalty',
  ].includes(type)
}

export const PlayerEventStats:FC<PlayerEventStatsProps> = ({ players, teams }) => {
  const { teamId, eventId, playerId } = useParams()
  const dispatch = useAppDispatch()
  const { performance } = useSelector(playerPerformanceSelector)
  const data = getPlayerActionsForSinglePlayer(performance, playerId)

  console.log('data', data)

  const isTeam = useMemo(() => {
    if(teams) {
      return teams.find(team => team.id === teamId)
    }
  }, [teamId, teams])

  const isPlayer = useMemo(() => {
    if(players) {
      return players.find(player => player.id === playerId)
    }
  }, [playerId, players])

  const renderStatsRow = (type: string, action?: PlayerActions) => {
    if(!action || !isValidActionType(type)) {
      return null
    }
    const playerActions: Action[] = action[type]
    const title = getStatTitle(type)
    const fullMatchAttempted = playerActions.length ?? 0
    const fullMatchCompleted = playerActions.filter(action => action.value === 'SUCCESSFUL').length ?? 0

    // First half stats
    const firstHalfActions = playerActions
      .filter(action => action.timestamp >= 0 && action.timestamp < 45)
    const firstHalfAttempted = firstHalfActions.length ?? 0
    const firstHalfCompleted = firstHalfActions
      .filter(action => action.value === 'SUCCESSFUL').length ?? 0

    // Second half stats
    const secondHalfActions = playerActions
      .filter(action => action.timestamp >= 45 && action.timestamp <= 90)
    const secondHalfAttempted = secondHalfActions.length ?? 0
    const secondHalfCompleted = secondHalfActions.filter(action => action.value === 'SUCCESSFUL').length ?? 0

    if(type === 'goals' || type === 'assists' || type === 'interceptions'
      || type === 'clearance' || type === 'fouls' || type === 'blocked_shots') {
      return (
        <TableRow key={title}>
          <TableCell>{title}</TableCell>
          <TableCell>{fullMatchAttempted}</TableCell>
          <TableCell>{firstHalfAttempted}</TableCell>
          <TableCell>{secondHalfAttempted}</TableCell>
        </TableRow>
      )
    }

    const firstHalfPercentage = firstHalfAttempted > 0 ?
      Math.ceil((firstHalfCompleted / firstHalfAttempted) * 100) : 0
    const secondHalfPercentage = secondHalfAttempted > 0 ?
      Math.ceil((secondHalfCompleted / secondHalfAttempted) * 100) : 0
    const fullMatchPercentage = fullMatchAttempted > 0 ?
      Math.ceil((fullMatchCompleted / fullMatchAttempted) * 100) : 0


    return (
      <TableRow key={title}>
        <TableCell>{title}</TableCell>
        <TableCell>
          {`${fullMatchAttempted}/${fullMatchCompleted}`}
          <Progress value={fullMatchPercentage} className='h-1.5'/>
        </TableCell>
        <TableCell>
          {`${firstHalfAttempted}/${firstHalfCompleted}`}
          <Progress value={firstHalfPercentage} className='h-1.5'/>
        </TableCell>
        <TableCell>
          {`${secondHalfAttempted}/${secondHalfCompleted}`}
          <Progress value={secondHalfPercentage} className='h-1.5'/>
        </TableCell>
      </TableRow>
    )
  }

  useEffect(() => {
    if (eventId) {
      dispatch(getPerformanceDataThunk({ eventId }))
    }
  }, [dispatch, eventId])

  if(!isPlayer || !isTeam) {
    return null
  }

  return (
    <DashboardLayout>
      <div className='py-2 px-2.5 md:py-10 md:px-12 bg-white'>
        <div className='text-xl text-dark-purple mb-5'>Player Statistics</div>
        <div className='flex flex-col md:flex-row md:justify-between border-b border-border-line pb-4 gap-5 md:items-center'>
          <div className='flex items-center gap-3'>
            <div className='h-[105px] rounded-full grid justify-center items-center overflow-hidden'>
              <img
                alt='player-image'
                src={isPlayer?.imageSrc}
                width={100}
                className='Single-player-view__header-media-img'
              />
            </div>
            <div className='Single-player-view__header-info'>
              <div className='Single-player-view__header-info--firstname'>{isPlayer.firstName}</div>
              <div className='Single-player-view__header-info--lastname'>{isPlayer.lastName}</div>
              <div className='Single-player-view__header-info--team'>
                <img
                  alt='team-image'
                  src={isTeam && isTeam.logo}
                  width={23}
                  className='Single-player-view__header-info--team-img'
                />
                <div className='Single-player-view__header-info--team-text'>{isTeam && isTeam.teamName}</div>
              </div>
            </div>
          </div>
          <Button className='h-fit flex gap-2 items-center w-fit'><FiDownload/>Export</Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 py-5 gap-11'>
          <div className='flex justify-between items-center'>
            <div className='text-xs font-medium text-sub-text'>AGE</div>
            <div className='font-medium text-sm text-text-grey'>{calculateAge(isPlayer.birthDate)}</div>
          </div>
          <div className='flex justify-between items-center'>
            <div className='text-xs font-medium text-sub-text'>NATIONALITY</div>
            <div className='font-medium text-sm text-text-grey'>{isPlayer.country}</div>
          </div>
          <div className='flex justify-between items-center'>
            <div className='text-xs font-medium text-sub-text'>POSITION</div>
            <div className='font-medium text-sm text-text-grey'>{isPlayer.position}</div>
          </div>
          <div className='flex justify-between items-center'>
            <div className='text-xs font-medium text-sub-text'>JERSEY NUMBER</div>
            <div className='font-medium text-sm text-text-grey'>{isPlayer.uniformNumber}</div>
          </div>
        </div>
      </div>
      <div className='my-6 bg-white py-5'>
        <div>
          <Tabs defaultValue='firstHalf' className='mx-4'>
            <TabsList className='bg-tabs-bg inline-flex justify-end p-0 mb-5'>
              <TabsTrigger value='firstHalf' className='data-[state=active]:bg-dark-purple data-[state=active]:text-white text-text-grey-2 py-2.5 px-3.5'>1st Half</TabsTrigger>
              <TabsTrigger value='secondHalf' className='data-[state=active]:bg-dark-purple data-[state=active]:text-white text-text-grey-2 py-2.5 px-3.5'>2nd Half</TabsTrigger>
              <TabsTrigger value='fullTime' className='data-[state=active]:bg-dark-purple data-[state=active]:text-white text-text-grey-2 py-2.5 px-3.5'>Full Time</TabsTrigger>
            </TabsList>
            <TabsContent value='firstHalf'>
              <FirstHalfStats />
            </TabsContent>
            <TabsContent value='secondHalf'>
              <FirstHalfStats />
            </TabsContent>
            <TabsContent value='fullTime'>
              <FirstHalfStats />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
