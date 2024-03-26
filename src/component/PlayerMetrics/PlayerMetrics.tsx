import { FC } from 'react'

import { TeamResult } from '../../api'

import SterlingImage from '../../assets/images/sterling.png'

import './PlayerMetrics.scss'
import { LinearProgress, linearProgressClasses } from '@mui/material'
import { styled } from '@mui/material/styles'

type PlayerMetricsProps = {
  team: TeamResult | undefined
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#AAACAF' : '#AAACAF',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#37003C' : '#37003C',
  },
}))

export const PlayerMetrics: FC<PlayerMetricsProps> = props => {
  return (
    <div className='Player-metrics'>
      <div className='Player-metrics__header'>
        <div className='Player-metrics__header-title'>Player Metrics</div>
        <div className='Player-metrics__header-form'>
          <form>
            <select className='Player-metrics__header-form--select' name='player'>
              <option>Player 1</option>
            </select>
          </form>
        </div>
      </div>
      <div className='Player-metrics__profile'>
        <div className='Player-metrics__profile-card'>
          <div className='Player-metrics__profile-card--media'>
            <img alt='profile-logo' src={SterlingImage} width={80} height={80} className='Player-metrics__profile-card--media-logo' />
          </div>
          <div className='Player-metrics__profile-card--name' >
            <div className='Player-metrics__profile-card--name-first-name' >Raheem</div>
            <div className='Player-metrics__profile-card--name-last-name' >Sterling</div>
            <div className='Player-metrics__profile-card--name-club' >
              <span className='Player-metrics__profile-card--name-club-img'>
                <img alt='club-logo' src={props.team?.logo} width={20} />
              </span>
              <span className='Player-metrics__profile-card--name-club-name'>{props.team?.teamName}</span>
            </div>
          </div>
        </div>
        <div className='Player-metrics__profile-metric'>
          <div className='Player-metrics__profile-metric-data'>
            <div className='Player-metrics__profile-metric-data-value'>22</div>
            <div className='Player-metrics__profile-metric-data-title'>Players</div>
          </div>
          <div className='Player-metrics__profile-metric-data'>
            <div className='Player-metrics__profile-metric-data-value'>22</div>
            <div className='Player-metrics__profile-metric-data-title'>Players</div>
          </div>
          <div className='Player-metrics__profile-metric-data'>
            <div className='Player-metrics__profile-metric-data-value'>22</div>
            <div className='Player-metrics__profile-metric-data-title'>Players</div>
          </div>
          <div className='Player-metrics__profile-metric-data'>
            <div className='Player-metrics__profile-metric-data-value'>22</div>
            <div className='Player-metrics__profile-metric-data-title'>Players</div>
          </div>
          <div className='Player-metrics__profile-metric-data'>
            <div className='Player-metrics__profile-metric-data-value'>22</div>
            <div className='Player-metrics__profile-metric-data-title'>Players</div>
          </div>
        </div>
      </div>
      <div className='Player-metrics__metrics'>
        <div className='Player-metrics__metrics-card'>
          <div className='Player-metrics__metrics-card-title'>Shooting</div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>Expected goals (xG)</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>2.58</div>
            </div>
            <BorderLinearProgress variant='determinate' value={25.8} />
          </div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>Non-penalty xG</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>3.58</div>
            </div>
            <BorderLinearProgress variant='determinate' value={35.8} />
          </div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>Shooting goal added per xG</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>2.18</div>
            </div>
            <BorderLinearProgress variant='determinate' value={21.8} />
          </div>
        </div>
        <div className='Player-metrics__metrics-card'>
          <div className='Player-metrics__metrics-card-title'>Chance creation</div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>Expected assists (xA)</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>5.58</div>
            </div>
            <BorderLinearProgress variant='determinate' value={55.8} />
          </div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>Open play xA</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>4.58</div>
            </div>
            <BorderLinearProgress variant='determinate' value={45.8} />
          </div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>xOVA</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>2.18</div>
            </div>
            <BorderLinearProgress variant='determinate' value={21.8} />
          </div>
        </div>
        <div className='Player-metrics__metrics-card'>
          <div className='Player-metrics__metrics-card-title'>Progression</div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>Expected threat (xG)</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>9.18</div>
            </div>
            <BorderLinearProgress variant='determinate' value={91.8} />
          </div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>One-two opened</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>6.58</div>
            </div>
            <BorderLinearProgress variant='determinate' value={65.8} />
          </div>
          <div className='Player-metrics__metrics-card-progress'>
            <div className='Player-metrics__metrics-card-progress-label'>
              <div className='Player-metrics__metrics-card-progress-label--title'>One-two closed</div>
              <div className='Player-metrics__metrics-card-progress-label--value'>6.00</div>
            </div>
            <BorderLinearProgress variant='determinate' value={60} />
          </div>
        </div>
      </div>
    </div>
  )
}
