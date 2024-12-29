import { FC, useEffect, useState } from 'react'
import { PlayerPerformance, TeamResponse } from '@/api'

import './StatsCard.scss'
import { usePlayers } from '@/hooks/usePlayers.ts'
import { calculateAge } from '@/services/helper.ts'
import { Link } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { Progress } from '@/components/ui/progress.tsx'
import { getPerformancesForPlayerThunk } from '@/store/slices/PlayerPerformanceSlice.ts'
import { useAppDispatch } from '@/store/types.ts'


type StatsCardProps = {
  team: TeamResponse | undefined
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
    console.log('performanceData', performanceData)
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
            <div className='Stats-card__header-info-data-value'>{averageAge}</div>
            <div className='Stats-card__header-info-data-title'>Average age</div>
          </div>
        </div>
      </div>
      <div className='Stats-card__content'>
        <div className='Stats-card__content-trends'>
          <div className='Stats-card__content-trends--title mb-8 font-semibold'>Player Comparison</div>
          <div className='px-4 flex justify-between'>
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
            <div className='px-4 grid items-center grid-cols-3 mb-2'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {firstPlayerStats.matchesPlayed}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.matchesPlayed,
                    firstPlayerStats.matchesPlayed + secondPlayerStats.matchesPlayed)}
                  className='col-span-5'
                />
              </div>
              <div className='text-sm text-center'>Matches Played</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.matchesPlayed,
                    firstPlayerStats.matchesPlayed + secondPlayerStats.matchesPlayed)}
                  className='col-span-5'
                />
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {secondPlayerStats.matchesPlayed}
                </div>
              </div>
            </div>
            <div className='px-4 grid items-center grid-cols-3 mb-2'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {firstPlayerStats.playerGoal}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.playerGoal,
                    firstPlayerStats.playerGoal + secondPlayerStats.playerGoal)}
                  className='col-span-5'
                />
              </div>
              <div className='text-sm text-center'>Goals</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.playerGoal,
                    firstPlayerStats.playerGoal + secondPlayerStats.playerGoal)}
                  className='col-span-5'
                />
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {secondPlayerStats.playerGoal}
                </div>
              </div>
            </div>
            <div className='px-4 grid items-center grid-cols-3 mb-2'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {firstPlayerStats.playerAssists}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.playerAssists,
                    firstPlayerStats.playerAssists + secondPlayerStats.playerAssists)}
                  className='col-span-5'
                />
              </div>
              <div className='text-sm text-center'>Assists</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.playerAssists,
                    firstPlayerStats.playerAssists + secondPlayerStats.playerAssists)}
                  className='col-span-5'
                />
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {secondPlayerStats.playerAssists}
                </div>
              </div>
            </div>
            <div className='px-4 grid items-center grid-cols-3 mb-2'>
              <div className='grid grid-cols-6 items-center gap-2'>
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {firstPlayerStats.passAccuracy}
                </div>
                <Progress
                  value={calculatePercentage(firstPlayerStats.passAccuracy,
                    firstPlayerStats.passAccuracy + secondPlayerStats.passAccuracy)}
                  className='col-span-5'
                />
              </div>
              <div className='text-sm text-center'>Pass Accuracy(%)</div>
              <div className='grid grid-cols-6 items-center gap-2'>
                <Progress
                  value={calculatePercentage(secondPlayerStats.passAccuracy,
                    firstPlayerStats.passAccuracy + secondPlayerStats.passAccuracy)}
                  className='col-span-5'
                />
                <div className='bg-dark-blue2 col-span-1 text-white p-1 text-xs rounded-full text-center'>
                  {secondPlayerStats.passAccuracy}
                </div>
              </div>
            </div>
            <div className='px-4 grid items-center grid-cols-3 mb-2'>
              {currentFirstPlayer &&
                <Link
                  to={`/team/${props.team?.id}/player/${currentFirstPlayer}/statistics`}
                  className='text-sm hover:underline'
                >
                  View full stats
                </Link>}
              <div></div>
              {currentSecondPlayer &&
                <Link
                  to={`/team/${props.team?.id}/player/${currentSecondPlayer}/statistics`}
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
              className='text-sm text-dark-purple flex gap-2 items-center w-fit border-b border-dark-purple'
            >
              Add new team <ArrowTopRightOnSquareIcon className='fill-dark-purple h-4'/>
            </Link>
            <Link to='staffs/add-staff'
              className='text-sm text-dark-purple flex gap-2 items-center w-fit border-b border-dark-purple'
            >
              Add new staff <ArrowTopRightOnSquareIcon className='fill-dark-purple h-4'/>
            </Link>
            <Link to='players/add-player'
              className='text-sm text-dark-purple flex gap-2 items-center w-fit border-b border-dark-purple'
            >
              Add new player <ArrowTopRightOnSquareIcon className='fill-dark-purple h-4'/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
