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
import { Progress } from '@/components/ui/progress.tsx';

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

  return (
    <DashboardLayout>
      <div className='Single-player-view'>
        <div className='Single-player-view__header'>
          <div className='Single-player-view__header-media'>
            <img
              alt='player-image'
              src={isPlayer?.imageSrc}
              width={100}
              className='Single-player-view__header-media-img'
            />
          </div>
          <div className='Single-player-view__header-info'>
            <div className='Single-player-view__header-info--firstname'>{isPlayer?.firstName}</div>
            <div className='Single-player-view__header-info--lastname'>{isPlayer?.lastName}</div>
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
        <div className='flex gap-3'>
          {isPlayer && <PlayerFieldPosition position={isPlayer.position}/>}
          <div className='px-2 my-5 w-full'>
            <h1 className='text-lg text-[#240026FF] font-medium'>Player Statistics</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='border-r'>Stats</TableHead>
                  <TableHead className='border-r'>Full-Match</TableHead>
                  <TableHead className='border-r'>1st half</TableHead>
                  <TableHead>2nd half</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statsTypes.map(type => {
                  return renderStatsRow(type, data?.actions)
                })}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
