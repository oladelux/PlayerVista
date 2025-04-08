import { FC, Fragment, useState } from 'react'

import { Link, useParams } from 'react-router-dom'

import { Player, PlayerActions } from '@/api'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
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
import { usePerformance } from '@/hooks/usePerformance.ts'
import { convertSecondsToGameMinute, getPlayerActions } from '@/utils/players.ts'

interface OtherStatsProps {
  players: Player[]
}

type OtherActionType = 'penalty' | 'yellowCard' | 'redCard'

export const OtherStats: FC<OtherStatsProps> = ({ players }) => {
  const { eventId } = useParams()
  const [timeRange, setTimeRange] = useState<number[]>([0, 90])
  const { performanceByEvent, loading, error } = usePerformance(undefined, eventId)

  const data = getPlayerActions(players, performanceByEvent)

  const renderPlayerActions = (actions: PlayerActions | undefined) => {
    const actionTypes: OtherActionType[] = ['penalty', 'yellowCard', 'redCard']
    if (!actions) {
      return actionTypes.map(type => {
        if (type === 'yellowCard' || type === 'redCard') {
          return (
            <Fragment key={type}>
              <TableCell className='border-r text-center'>0</TableCell>
            </Fragment>
          )
        }
        return (
          <Fragment key={type}>
            <TableCell className='border-r text-center' key={`${type}-total`}>
              0
            </TableCell>
            <TableCell className='border-r text-center' key={`${type}-successful`}>
              0
            </TableCell>
          </Fragment>
        )
      })
    }
    return actionTypes.map(type => {
      const filteredActions = actions[type]?.filter(
        action => action.timestamp >= timeRange[0] && action.timestamp <= timeRange[1],
      )
      if (type === 'yellowCard' || type === 'redCard') {
        return (
          <Fragment key={type}>
            <TableCell className='border-r text-center'>{filteredActions?.length ?? 0}</TableCell>
          </Fragment>
        )
      }
      return (
        <Fragment key={type}>
          <TableCell className='border-r text-center'>{filteredActions?.length ?? 0}</TableCell>
          <TableCell className='border-r text-center'>
            {filteredActions?.filter(action => action.value === 'SUCCESSFUL').length ?? 0}
          </TableCell>
        </Fragment>
      )
    })
  }

  const getPlayerDataById = (
    id: string,
  ): { actions: PlayerActions | undefined; minutePlayed: number } | undefined => {
    const playerData = data.find(player => player.playerId === id)
    if (playerData) {
      return { actions: playerData.actions, minutePlayed: playerData.minutePlayed }
    }
    return undefined
  }

  if (loading) return <LoadingPage />
  //TODO: Create Error Page
  if (error) {
    return 'This is an error page'
  }
  return (
    <>
      <div className='my-8'>
        <div className='mb-4'>Time</div>
        <Slider
          value={timeRange}
          min={0}
          max={90}
          step={1}
          minStepsBetweenThumbs={1}
          onValueChange={value => setTimeRange(value)}
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
              <TableHead colSpan={2} className='border-r text-center'>
                Penalty
              </TableHead>
              <TableHead className='border-r'>Y.Card</TableHead>
              <TableHead className='border-r'>R.Card</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r text-center' title='Penalty Given Away'>
                P.Gvn
              </TableHead>
              <TableHead className='border-r text-center' title='Penalty Awarded'>
                P.Awrd
              </TableHead>
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
                  <TableCell className='border-r'>
                    {matchData?.minutePlayed
                      ? convertSecondsToGameMinute(matchData.minutePlayed)
                      : 0}
                  </TableCell>
                  <TableCell className='border-r'>
                    <Link
                      to={`player/${player.id}`}
                    >{`${player.firstName} ${player.lastName}`}</Link>
                  </TableCell>
                  {/*//TODO: Fix this*/}
                  <TableCell className='border-r'>
                    {matchData?.minutePlayed
                      ? convertSecondsToGameMinute(matchData.minutePlayed)
                      : 0}
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
