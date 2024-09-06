import { FC, Fragment, useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider.tsx'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { convertSecondsToGameMinute, getPlayerActions } from '@/utils/players.ts'
import { Player, PlayerActions } from '@/api'
import { useSelector } from 'react-redux'
import { getPerformanceDataThunk, playerPerformanceSelector } from '@/store/slices/PlayerPerformanceSlice.ts'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from '@/store/types.ts'

interface GeneralStatsProps {
  players: Player[]
}
type GeneralActionType = 'pass' | 'tackles' | 'shots' | 'aerial_duels' | 'goals' | 'assists';

export const GeneralStats: FC<GeneralStatsProps> = ({ players }) => {
  const { eventId } = useParams()
  const dispatch = useAppDispatch()
  const [timeRange, setTimeRange] = useState<number[]>([0, 90])
  const { performance } = useSelector(playerPerformanceSelector)

  const data = getPlayerActions(players, performance)

  const getPlayerDataById =
  (id: string): { actions: PlayerActions | undefined, minutePlayed: number } | undefined => {
    const playerData = data.find((player) => player.playerId === id)
    if(playerData){
      return { actions: playerData.actions, minutePlayed: playerData.minutePlayed }
    }
    return undefined
  }

  const renderPlayerActions = (actions: PlayerActions | undefined) => {
    const actionTypes: GeneralActionType[] = ['pass', 'tackles', 'shots', 'aerial_duels', 'goals', 'assists']
    if (!actions) {
      return actionTypes.map((type) => {
        if(type === 'goals' || type === 'assists') {
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
      if(type === 'goals' || type === 'assists') {
        return (
          <Fragment key={type}>
            <TableCell className='text-center border-r'>
              {filteredActions.length ?? 0}
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

  useEffect(() => {
    if(eventId) {
      dispatch(getPerformanceDataThunk({ eventId }))
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
              <TableHead colSpan={2} className='text-center border-r'>Passes</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Tackles</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Shooting</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Aerial Duels</TableHead>
              <TableHead className='border-r'>Goals</TableHead>
              <TableHead className='border-r'>Assists</TableHead>
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
              <TableHead className='text-center border-r' title='Completed Duels'>CMP</TableHead>
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
