import { Fragment, useEffect, useState } from 'react'

import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { useOutletContext, useParams } from 'react-router-dom'

import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import DownloadPdfButton from '@/component/DownloadPdfButton/DownloadPdfButton.tsx'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage.tsx'
import PlayerDataTab from '@/component/PlayerDataTab/PlayerDataTab.tsx'
import ProfileTeamImage from '@/component/ProfileTeamImage/ProfileTeamImage.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { PdfType } from '@/config/PdfType.ts'
import { useEvents } from '@/hooks/useEvents.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'
import { calculateAge, formatDate } from '@/services/helper.ts'
import {
  clearPlayerPerformanceData,
  getPerformanceByEventAndPlayerThunk,
  playerPerformanceSelector,
} from '@/store/slices/PlayerPerformanceSlice.ts'
import { useAppDispatch } from '@/store/types.ts'
import {
  DefensiveMetrics,
  DisciplineMetric,
  getHalfData,
  GoalkeepingMetrics,
  HalfType,
  OffensiveMetrics,
  PossessionMetrics,
} from '@/utils/phaseMetrics.ts'
import { singleMatchOffensiveData } from '@/utils/players.ts'
import { PlayerFieldPosition } from '@/views/SingleEventView/PlayerEventStats/PlayerFieldPosition.tsx'

import ClubLogo from '../../../assets/images/club.png'

export function PlayerEventStats() {
  const [selectedHalf, setSelectedHalf] = useState<HalfType>(HalfType.FullTime)
  const { eventId, playerId, teamId } = useParams()
  const dispatch = useAppDispatch()
  const { playerPerformance } = useSelector(playerPerformanceSelector)
  const { player } = usePlayer(playerId)
  const {
    teams,
    teamsError: error,
    teamsLoading: loading,
  } = useOutletContext<DashboardLayoutOutletContext>()
  const team = teams.find(team => team.id === teamId)
  const { event, loading: eventLoading, error: eventError } = useEvents(undefined, eventId)

  useEffect(() => {
    if (eventId && playerId) {
      dispatch(clearPlayerPerformanceData())
      dispatch(getPerformanceByEventAndPlayerThunk({ eventId, playerId }))
    }
  }, [dispatch, eventId, playerId])

  const halfData = getHalfData(playerPerformance, selectedHalf)
  const handleHalfSelection = (half: HalfType) => setSelectedHalf(half)

  const singleMatchData = playerPerformance && singleMatchOffensiveData(playerPerformance)

  if (loading || eventLoading) return <LoadingPage />
  //TODO: Create Error Page
  if (error || eventError || !player) return 'This is an error page'

  return (
    <Fragment>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className='mb-5 text-sub-text'>Player Stats</div>
        <div className='flex items-center justify-between border-b border-border-line pb-5'>
          <ProfileTeamImage playerId={playerId} teamId={teamId} />
          <DownloadPdfButton
            filename={`${player.lastName}_${player.firstName}`}
            pdfType={PdfType.SINGLE_MATCH_PLAYER_REPORT}
            templateName='singleMatchPlayerReport'
            data={{
              player,
              team,
              isEvent: event,
              isTeam: team,
              totalMinutesPlayed: playerPerformance?.minutePlayed,
              offensiveData: singleMatchData?.offensiveData,
              defensiveData: singleMatchData?.defensiveData,
              possessionData: singleMatchData?.possessionData,
              disciplinaryData: singleMatchData?.disciplinaryData,
              goalkeeperData: singleMatchData?.goalkeeperData,
            }}
          />
        </div>
        <div className='mt-5 grid grid-cols-3 gap-10'>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>AGE</div>
            <div className='text-xs'>{calculateAge(player.birthDate)}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>POSITION</div>
            <div className='text-xs'>{player.position}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>JERSEY NUMBER</div>
            <div className='text-xs'>{player.uniformNumber}</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-sub-text'>MINUTE PLAYED</div>
            <div className='text-xs'>{playerPerformance?.minutePlayed ?? 0}</div>
          </div>
        </div>
      </div>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className='mb-5 text-sub-text'>Match Information</div>
        <div className='grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-3'>
          <div className='col-span-1 md:col-span-2'>
            <div className='grid grid-cols-3 items-center gap-5 text-center'>
              <div className='flex flex-col items-center'>
                <img src={team?.logo} width={64} alt='team-logo' />
                <div className='mb-5'>{team?.teamName}</div>
              </div>
              <div>vs.</div>
              <div className='flex flex-col items-center'>
                <img src={ClubLogo} width={64} alt='team-logo' />
                <div className='mb-5'>{event?.opponent}</div>
              </div>
            </div>
            <div className='mt-5 text-center'>
              <div>Location: {event?.eventLocation}</div>
              <div>Date: {event && formatDate(new Date(event.startDate))}</div>
            </div>
          </div>
          <div className='col-span-1'>
            <PlayerFieldPosition position={player.position} />
          </div>
        </div>
      </div>
      <div className='mb-5 rounded-md bg-white px-2.5 py-2 md:px-12 md:py-10'>
        <div className='grid justify-end'>
          <div className='grid grid-cols-3 rounded-md bg-card-stat-bg'>
            <div
              className={classnames(
                'cursor-pointer rounded-l-md p-2.5 text-text-grey-2',
                selectedHalf === 'fullTime' && 'bg-dark-purple' + ' text-white',
              )}
              onClick={() => handleHalfSelection(HalfType.FullTime)}
            >
              Full Time
            </div>
            <div
              className={classnames(
                'cursor-pointer p-2.5 text-text-grey-2',
                selectedHalf === 'firstHalf' && 'bg-dark-purple' + ' text-white',
              )}
              onClick={() => handleHalfSelection(HalfType.FirstHalf)}
            >
              1st Half
            </div>
            <div
              className={classnames(
                'cursor-pointer rounded-r-md p-2.5 text-text-grey-2',
                selectedHalf === 'secondHalf' && 'bg-dark-purple' + ' text-white',
              )}
              onClick={() => handleHalfSelection(HalfType.SecondHalf)}
            >
              2nd Half
            </div>
          </div>
        </div>
        <div className='my-5'>
          <Tabs defaultValue='offensive'>
            <TabsList className='mb-5 contents gap-3 bg-transparent p-0 md:grid md:grid-cols-5'>
              <TabsTrigger
                value='offensive'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                Offensive
              </TabsTrigger>
              <TabsTrigger
                value='defensive'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                Defensive
              </TabsTrigger>
              <TabsTrigger
                value='possession'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                Possession
              </TabsTrigger>
              <TabsTrigger
                value='disciplinary'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                Disciplinary
              </TabsTrigger>
              <TabsTrigger
                value='goalkeeping'
                className='border-b-2 border-transparent px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-md data-[state=active]:border-b-2 data-[state=active]:border-dark-purple data-[state=active]:bg-light-purple data-[state=active]:text-dark-purple'
              >
                Goalkeeping
              </TabsTrigger>
            </TabsList>
            <TabsContent value='offensive' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={OffensiveMetrics} actions={halfData} />
            </TabsContent>
            <TabsContent value='defensive' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={DefensiveMetrics} actions={halfData} />
            </TabsContent>
            <TabsContent value='possession' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={PossessionMetrics} actions={halfData} />
            </TabsContent>
            <TabsContent value='disciplinary' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={DisciplineMetric} actions={halfData} />
            </TabsContent>
            <TabsContent value='goalkeeping' className='rounded-lg border border-border-line p-6'>
              <PlayerDataTab metrics={GoalkeepingMetrics} actions={halfData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Fragment>
  )
}
