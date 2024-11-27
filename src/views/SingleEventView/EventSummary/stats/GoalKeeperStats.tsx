import { FC, Fragment, useEffect, useState } from 'react'
import { Player, PlayerActions } from '@/api'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from '@/store/types.ts'
import { useSelector } from 'react-redux'
import { getPerformanceByEventThunk, playerPerformanceSelector } from '@/store/slices/PlayerPerformanceSlice.ts'
import { convertSecondsToGameMinute, getPlayerActions } from '@/utils/players.ts'
import { Slider } from '@/components/ui/slider.tsx'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'

interface GoalKeeperStatsProps {
  players: Player[]
}

//TODO: Add cleanSheet action type
type GoalKeeperActionType = 'saves' | 'aerialClearance' | 'goals' | 'assists';

export const GoalKeeperStats: FC<GoalKeeperStatsProps> = ({ players }) => {

  const { eventId } = useParams()
  const dispatch = useAppDispatch()
  const [timeRange, setTimeRange] = useState<number[]>([0, 90])
  const { performance } = useSelector(playerPerformanceSelector)

  const data = getPlayerActions(players, performance)

  // Sort players by position, making sure goalkeepers are at the top
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.position === 'GK') return -1
    if (b.position === 'GK') return 1
    return 0 // Default sorting if position is not 'GK'
  })

  const renderPlayerActions = (actions: PlayerActions | undefined) => {
    const actionTypes: GoalKeeperActionType[] = ['saves', 'aerialClearance', 'goals', 'assists']
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
              <TableHead colSpan={2} className='text-center border-r'>Saves</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Passes</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Aerial Clearance</TableHead>
              <TableHead className='border-r'>Goals</TableHead>
              <TableHead className='border-r'>Assists</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='text-center border-r' title='Total Shots Faced'>TSF</TableHead>
              <TableHead className='text-center border-r' title='Total Shots Saved'>TSS</TableHead>
              <TableHead className='text-center border-r' title='Attempted Passes'>ATP</TableHead>
              <TableHead className='text-center border-r' title='Completed Passes'>CMP</TableHead>
              <TableHead className='text-center border-r' title='Attempted Clearance'>ATC</TableHead>
              <TableHead className='text-center border-r' title='Successful Clearance'>SUC</TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map(player => {
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
