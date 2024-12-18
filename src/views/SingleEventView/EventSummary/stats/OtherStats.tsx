import { FC, Fragment, useEffect, useState } from 'react'
import { Player, PlayerActions } from '@/api'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from '@/store/types.ts'
import { useSelector } from 'react-redux'
import { getPerformanceByEventThunk, playerPerformanceSelector } from '@/store/slices/PlayerPerformanceSlice.ts'
import { convertSecondsToGameMinute, getPlayerActions } from '@/utils/players.ts'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { Slider } from '@/components/ui/slider.tsx'

interface OtherStatsProps {
  players: Player[]
}

type OtherActionType = 'penalty' | 'yellowCard' | 'redCard'

export const OtherStats: FC<OtherStatsProps> = ({ players }) => {
  const { eventId } = useParams()
  const dispatch = useAppDispatch()
  const [timeRange, setTimeRange] = useState<number[]>([0, 90])
  const { performance } = useSelector(playerPerformanceSelector)

  const data = getPlayerActions(players, performance)

  const renderPlayerActions = (actions: PlayerActions | undefined) => {
    const actionTypes: OtherActionType[] = ['penalty', 'yellowCard', 'redCard']
    if (!actions) {
      return actionTypes.map((type) => {
        if(type === 'yellowCard' || type === 'redCard') {
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
      if(type === 'yellowCard' || type === 'redCard') {
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
              <TableHead className='border-r'>Total App</TableHead>
              <TableHead colSpan={2} className='text-center border-r'>Penalty</TableHead>
              <TableHead className='border-r'>Y.Card</TableHead>
              <TableHead className='border-r'>R.Card</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='text-center border-r' title='Penalty Given Away'>P.Gvn</TableHead>
              <TableHead className='text-center border-r' title='Penalty Awarded'>P.Awrd</TableHead>
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
                  {/*//TODO: Fix this*/}
                  <TableCell className='border-r'>{matchData?.minutePlayed ?
                    convertSecondsToGameMinute(matchData.minutePlayed) : 0}
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
