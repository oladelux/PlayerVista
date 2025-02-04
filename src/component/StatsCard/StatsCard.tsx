import { FC, useEffect, useState } from 'react'

import { PlayerPerformance, TeamResponse } from '@/api'

import './StatsCard.scss'
import { Progress } from '@/components/ui/progress.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { usePlayers } from '@/hooks/usePlayers.ts'
import { calculateAge } from '@/services/helper.ts'

import { Link } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'

import { getPerformancesForPlayerThunk } from '@/store/slices/PlayerPerformanceSlice.ts'
import { useAppDispatch } from '@/store/types.ts'


type StatsCardProps = {
  team: TeamResponse | null
}

export const StatsCard: FC<StatsCardProps> = props => {
  const { players } = usePlayers(props.team?.id)
  const dispatch = useAppDispatch()
  const averageAge = players.length > 0
    ? players.reduce((acc, player) => acc + calculateAge(player.birthDate), 0) / players.length
    : 0
  const [currentFirstPlayer, setCurrentFirstPlayer] = useState<string>('')
  const [currentSecondPlayer, setCurrentSecondPlayer] = useState<string>('')
  const [firstPlayerPerformance, setFirstPlayerPerformance] = useState<PlayerPerformance[]>([])
  const [secondPlayerPerformance, setSecondPlayerPerformance] = useState<PlayerPerformance[]>([])

  function handleFirstPlayerChange(value: string) {
    setCurrentFirstPlayer(value)
  }

  function handleSecondPlayerChange(value: string) {
    setCurrentSecondPlayer(value)
  }

  function calculatePercentage(value: number, max: number): number {
    return (value / max) * 100
  }

  function calculatePerformance(performanceData: PlayerPerformance[]) {
    return performanceData.reduce((acc, event) => {
      acc.matchesPlayed += 1
      acc.playerGoal += event.actions['goals'].length
      acc.playerAssists += event.actions['assists'].length
      const totalPasses = event.actions['passes'].length
      const successfulPasses = event.actions['passes'].filter((pass) => pass.value === 'SUCCESSFUL').length ?? 0
      acc.totalPasses += totalPasses
      acc.successfulPasses += successfulPasses
      acc.passAccuracy = acc.totalPasses > 0 ? (acc.successfulPasses / acc.totalPasses) * 100 : 0
      return acc
    }, {
      matchesPlayed: 0,
      playerGoal: 0,
      playerAssists: 0,
      totalPasses: 0,
      successfulPasses: 0,
      passAccuracy: 0,
    })
  }

  useEffect(() => {
    if(currentFirstPlayer) {
      dispatch(getPerformancesForPlayerThunk({ playerId: currentFirstPlayer }))
    }
  }, [dispatch, currentFirstPlayer])

  useEffect(() => {
    if (currentFirstPlayer) {
      dispatch(getPerformancesForPlayerThunk({ playerId: currentFirstPlayer }))
        .then((action: any) => {
          setFirstPlayerPerformance(action.payload.data)
        })
    }
  }, [dispatch, currentFirstPlayer])

  useEffect(() => {
    if (currentSecondPlayer) {
      dispatch(getPerformancesForPlayerThunk({ playerId: currentSecondPlayer }))
        .then((action: any) => {
          setSecondPlayerPerformance(action.payload.data)
        })
    }
  }, [dispatch, currentSecondPlayer])

  const firstPlayerStats = calculatePerformance(firstPlayerPerformance)
  const secondPlayerStats = calculatePerformance(secondPlayerPerformance)

  return (
    <div className='Stats-card'>
      <div className='Stats-card__header'>
        <div className='Stats-card__header-basic'>
          <img alt='team-logo' className='Stats-card__header-basic-image' src={props.team?.logo} />
          <div className='Stats-card__header-basic-title'>{props.team?.teamName}</div>
        </div>
        <div className='Stats-card__header-info'>
          <div className='Stats-card__header-info-data'>
            <div className='Stats-card__header-info-data-value'>{players.length}</div>
            <div className='Stats-card__header-info-data-title'>Players</div>
          </div>
          <div className='Stats-card__header-info-data'>
            <div className='Stats-card__header-info-data-value'>{Math.round(averageAge)}</div>
            <div className='Stats-card__header-info-data-title'>Average age</div>
          </div>
        </div>
      </div>
      <div className='Stats-card__content'>
        <div className='Stats-card__content-trends'>
          <div className='Stats-card__content-trends--title mb-8 font-semibold'>Player Comparison</div>
          <div className='flex justify-between px-4'>
            <Select
              onValueChange={handleFirstPlayerChange}
              defaultValue={currentFirstPlayer}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Player 1'/>
              </SelectTrigger>
              <SelectContent>
                {players
                  .filter(player => player.id !== currentSecondPlayer)
                  .map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.firstName} {player.lastName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleSecondPlayerChange}
              defaultValue={currentSecondPlayer}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Player 2'/>
              </SelectTrigger>
              <SelectContent>
                {players
                  .filter(player => player.id !== currentFirstPlayer)
                  .map(player => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.firstName} {player.lastName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className='my-8'>
            <div className='mb-2 grid grid-cols-3 items-center px-4'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {firstPlayerStats.matchesPlayed}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.matchesPlayed,
                    firstPlayerStats.matchesPlayed + secondPlayerStats.matchesPlayed)}
                  className='col-span-5'
                />
              </div>
              <div className='text-center text-sm'>Matches Played</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.matchesPlayed,
                    firstPlayerStats.matchesPlayed + secondPlayerStats.matchesPlayed)}
                  className='col-span-5'
                />
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {secondPlayerStats.matchesPlayed}
                </div>
              </div>
            </div>
            <div className='mb-2 grid grid-cols-3 items-center px-4'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {firstPlayerStats.playerGoal}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.playerGoal,
                    firstPlayerStats.playerGoal + secondPlayerStats.playerGoal)}
                  className='col-span-5'
                />
              </div>
              <div className='text-center text-sm'>Goals</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.playerGoal,
                    firstPlayerStats.playerGoal + secondPlayerStats.playerGoal)}
                  className='col-span-5'
                />
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {secondPlayerStats.playerGoal}
                </div>
              </div>
            </div>
            <div className='mb-2 grid grid-cols-3 items-center px-4'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {firstPlayerStats.playerAssists}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.playerAssists,
                    firstPlayerStats.playerAssists + secondPlayerStats.playerAssists)}
                  className='col-span-5'
                />
              </div>
              <div className='text-center text-sm'>Assists</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.playerAssists,
                    firstPlayerStats.playerAssists + secondPlayerStats.playerAssists)}
                  className='col-span-5'
                />
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {secondPlayerStats.playerAssists}
                </div>
              </div>
            </div>
            <div className='mb-2 grid grid-cols-3 items-center px-4'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {firstPlayerStats.passAccuracy}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.passAccuracy,
                    firstPlayerStats.passAccuracy + secondPlayerStats.passAccuracy)}
                  className='col-span-5'
                />
              </div>
              <div className='text-center text-sm'>Pass Accuracy(%)</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.passAccuracy,
                    firstPlayerStats.passAccuracy + secondPlayerStats.passAccuracy)}
                  className='col-span-5'
                />
                <div className='col-span-1 rounded-full bg-dark-blue2 p-1 text-center text-xs text-white'>
                  {secondPlayerStats.passAccuracy}
                </div>
              </div>
            </div>
            <div className='mb-2 grid grid-cols-3 items-center px-4'>
              {currentFirstPlayer &&
                <Link
                  to={`/${props.team?.id}/player/${currentFirstPlayer}/statistics`}
                  className='text-sm hover:underline'
                >
                  View full stats
                </Link>}
              <div></div>
              {currentSecondPlayer &&
                <Link
                  to={`/${props.team?.id}/player/${currentSecondPlayer}/statistics`}
                  className='text-sm hover:underline'
                >
                  View full stats
                </Link>}
            </div>
          </div>
        </div>
        <div className='Stats-card__content-overview'>
          <div className='Stats-card__content-overview--title mb-8 font-semibold'>Quick Links</div>
          <div className='flex flex-col gap-3 px-5'>
            <Link to='team/create-team'
              className='flex w-fit items-center gap-2 border-b border-dark-purple text-sm text-dark-purple'
            >
              Add new team <ArrowTopRightOnSquareIcon className='h-4 fill-dark-purple'/>
            </Link>
            <Link to='staffs/add-staff'
              className='flex w-fit items-center gap-2 border-b border-dark-purple text-sm text-dark-purple'
            >
              Add new staff <ArrowTopRightOnSquareIcon className='h-4 fill-dark-purple'/>
            </Link>
            <Link to='players/add-player'
              className='flex w-fit items-center gap-2 border-b border-dark-purple text-sm text-dark-purple'
            >
              Add new player <ArrowTopRightOnSquareIcon className='h-4 fill-dark-purple'/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
