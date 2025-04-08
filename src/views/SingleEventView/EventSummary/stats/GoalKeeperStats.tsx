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

interface GoalKeeperStatsProps {
  players: Player[]
}

//TODO: Add cleanSheet action type
type GoalKeeperActionType =
  | 'saves'
  | 'OneVOneSaves'
  | 'penaltySaves'
  | 'goalConceded'
  | 'freekickSaves'

export const GoalKeeperStats: FC<GoalKeeperStatsProps> = ({ players }) => {
  const { eventId } = useParams()
  const [timeRange, setTimeRange] = useState<number[]>([0, 90])
  const { performanceByEvent, loading, error } = usePerformance(undefined, eventId)

  const data = getPlayerActions(players, performanceByEvent)

  // Sort players by position, making sure goalkeepers are at the top
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.position === 'GK') return -1
    if (b.position === 'GK') return 1
    return 0 // Default sorting if position is not 'GK'
  })

  const renderPlayerActions = (actions: PlayerActions | undefined) => {
    const actionTypes: GoalKeeperActionType[] = [
      'saves',
      'OneVOneSaves',
      'goalConceded',
      'penaltySaves',
      'freekickSaves',
    ]
    if (!actions) {
      return actionTypes.map(type => {
        if (
          type === 'OneVOneSaves' ||
          type === 'goalConceded' ||
          type === 'penaltySaves' ||
          type === 'freekickSaves'
        ) {
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
      if (
        type === 'OneVOneSaves' ||
        type === 'goalConceded' ||
        type === 'penaltySaves' ||
        type === 'freekickSaves'
      ) {
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
              <TableHead colSpan={2} className='border-r text-center'>
                Saves
              </TableHead>
              <TableHead className='border-r'>1v1 Saves</TableHead>
              <TableHead className='border-r'>Goals Conceded</TableHead>
              <TableHead className='border-r'>Pen Saves</TableHead>
              <TableHead className='border-r'>FK Saves</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r text-center' title='Total Shots Faced'>
                TSF
              </TableHead>
              <TableHead className='border-r text-center' title='Total Shots Saved'>
                TSS
              </TableHead>
              <TableHead className='border-r'></TableHead>
              <TableHead className='border-r'></TableHead>
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
