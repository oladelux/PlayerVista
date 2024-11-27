import { FC, Fragment, useEffect, useState } from 'react'
import { Player, PlayerActions } from '@/api'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from '@/store/types.ts'
import { useSelector } from 'react-redux'
import {
  getPerformanceByEventThunk,
  playerPerformanceSelector,
} from '@/store/slices/PlayerPerformanceSlice.ts'
import { convertSecondsToGameMinute, getPlayerActions } from '@/utils/players.ts'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { Slider } from '@/components/ui/slider.tsx'

interface AttackingStatsProps {
  players: Player[]
}

type AttackingActionType = 'shots' | 'dribbles' | 'cornerKicks' | 'freekicks' | 'offside' | 'goals' | 'assists'

export const AttackingStats: FC<AttackingStatsProps> = ({ players }) => {
  const { eventId } = useParams()
  const dispatch = useAppDispatch()
  const [timeRange, setTimeRange] = useState<number[]>([0, 90])
  const { performance } = useSelector(playerPerformanceSelector)

  const data = getPlayerActions(players, performance)

  const renderPlayerActions = (actions: PlayerActions | undefined) => {
    const actionTypes: AttackingActionType[] = ['shots', 'dribbles', 'cornerKicks', 'freekicks', 'offside', 'goals', 'assists']
    if (!actions) {
      return actionTypes.map((type) => {
        if(type === 'goals' || type === 'assists' || type === 'offside') {
          return (
            <Fragment key={type}>
              <TableCell className='text-center border-r'>
                0
              </TableCell>
            </Fragment>
          )
        }
        return (
          <Fragment key={type}>
            <TableCell className='text-center border-r' key={`${type}-total`}>0</TableCell>
            <TableCell className='text-center border-r' key={`${type}-successful`}>0</TableCell>
          </Fragment>
        ) })
    }
    return actionTypes.map((type) => {
      const filteredActions = actions[type]?.filter(action =>
        action.timestamp >= timeRange[0] && action.timestamp <= timeRange[1],
      )
      if(type === 'goals' || type === 'assists' || type === 'offside') {
        return (
          <Fragment key={type}>
            <TableCell className='text-center border-r'>
              {filteredActions?.length ?? 0}
            </TableCell>
          </Fragment>
        )
      }
      return (
        <Fragment key={type}>
          <TableCell className='text-center border-r'>
            {filteredActions?.length ?? 0}
          </TableCell>
          <TableCell className='text-center border-r'>
            {filteredActions?.filter((action) => action.value === 'SUCCESSFUL').length ?? 0}
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

  useEffect(() => {
    if(eventId) {
      dispatch(getPerformanceByEventThunk({ eventId }))
    }
  }, [dispatch, eventId])
  return (
    <>
      <div className='my-8'>
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
              <TableHead colSpan={2} className='text-center border-r'>Shots</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Dribble</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Corner</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Free Kick</TableHead>
              <TableHead className='border-r'>Offside</TableHead>
              <TableHead className='border-r'>Goals</TableHead>
              <TableHead className='border-r'>Assists</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='text-center border-r' title='Shots on'>Sht.On</TableHead>
              <TableHead className='text-center border-r' title='Shots Off'>Sht.Off</TableHead>
              <TableHead className='text-center border-r' title='Attempted Dribble'>ATT.Drb</TableHead>
              <TableHead className='text-center border-r' title='Successful Dribble'>SUC.Drb</TableHead>
              <TableHead className='text-center border-r' title='Left Corner'>L.Cnr</TableHead>
              <TableHead className='text-center border-r' title='Right Corner'>R.Cnr</TableHead>
              <TableHead className='text-center border-r' title='Free Kick Won'>FK.Won</TableHead>
              <TableHead className='text-center border-r' title='Free Kick Given'>FK.Given</TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map(player => {
              const matchData = getPlayerDataById(player.id)
              return (
                <TableRow key={`${player.firstName}-${player.id}`}>
                  <TableCell className='border-r'>{player.uniformNumber}</TableCell>
                  <TableCell className='border-r'>{player.position}</TableCell>
                  <TableCell className='border-r'>{matchData?.minutePlayed ?
                    convertSecondsToGameMinute(matchData.minutePlayed) : 0}
                  </TableCell>
                  <TableCell className='border-r'>
                    <Link to={`${player.id}`}>{`${player.firstName} ${player.lastName}`}</Link>
                  </TableCell>
                  {renderPlayerActions(matchData?.actions)}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

      </div>
    </>
  )
}
