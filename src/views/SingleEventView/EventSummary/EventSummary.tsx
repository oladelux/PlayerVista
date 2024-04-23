import { FC, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'

import { Player } from '../../../api'

import { DashboardLayout } from '../../../component/DashboardLayout/DashboardLayout.tsx'
import { TabButton } from '../../../component/TabButton/TabButton.tsx'
import { TabContent } from '../../../component/TabContent/TabContent.tsx'
import { PlayerSummaryStats } from './PlayerSummaryStats/PlayerSummaryStats.tsx'

import ClubLogo from '../../../assets/images/club.png'

import './EventSummary.scss'

const tabCategory = ['Summary', 'Player Stats']

type EventSummaryProps = {
  players: Player[]
}

export const EventSummary:FC<EventSummaryProps> = ({ players }) => {
  const [selectedCategory, setSelectedCategory] = useState('')

  const activeCategory = selectedCategory || tabCategory[0]

  return (
    <DashboardLayout>
      <div className='Event-summary'>
        <div className='Event-summary__header'>
          <div className='Event-summary__header-home'>
            <div className='Event-summary__header-home--media'>
              <img src={ClubLogo} alt='club-logo' />
            </div>
            <div className='Event-summary__header-home--name'>
              Team A
            </div>
          </div>
          <div className='Event-summary__header-score'>
            <div className='Event-summary__header-score--home'>0</div>
            <div className='Event-summary__header-score--divider'>:</div>
            <div className='Event-summary__header-score--away'>0</div>
          </div>
          <div className='Event-summary__header-away'>
            <div className='Event-summary__header-away--name'>
              Team B
            </div>
            <div className='Event-summary__header-away--media'>
              <img src={ClubLogo} alt='club-logo'/>
            </div>
          </div>
        </div>
        <div className='Event-summary__content'>
          <div className='Event-summary__content-tab'>
            {tabCategory.map(category =>
              <TabButton
                className='Event-summary__content-tab-category'
                key={category}
                isActive={activeCategory === category}
                onClick={() => setSelectedCategory(category)}>{category}
              </TabButton>,
            )}
          </div>
          <div className='Event-summary__content-section'>
            {tabCategory.map(category =>
              <TabContent key={category} isActive={activeCategory === category}>
                {category === 'Summary' && <SummaryContent />}
                {category === 'Player Stats' && <PlayerSummaryStats players={players} />}
              </TabContent>,
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

const SummaryContent = () => {
  return (
    <div className='Summary-wrapper'>
      <div className='Summary-wrapper__content'>
        <div className='Summary-wrapper__content-box'>
          <div className='Summary-wrapper__content-box-data'>
            <div className='Summary-wrapper__content-box-data--home'>34%</div>
            <div className='Summary-wrapper__content-box-data--title'>Possession</div>
            <div className='Summary-wrapper__content-box-data--away'>66%</div>
          </div>
          <div className='Summary-wrapper__content-box-bar'>
            <div className='Summary-wrapper__content-box-bar--home'>
              <LinearProgress
                className='Summary-wrapper__content-box-bar--home-signal'
                value={34}
                sx={{
                  '.MuiLinearProgress-bar': {
                    transform: `translateX(${100 - 34}%)!important`,
                  },
                }}
                variant='determinate'
              />
            </div>
            <div className='Summary-wrapper__content-box-bar--away'>
              <LinearProgress className='Summary-wrapper__content-box-bar--away-signal' value={66}
                variant='determinate'/>
            </div>
          </div>
        </div>
        <div className='Summary-wrapper__content-box'>
          <div className='Summary-wrapper__content-box-data'>
            <div className='Summary-wrapper__content-box-data--home'>10</div>
            <div className='Summary-wrapper__content-box-data--title'>Total Shots</div>
            <div className='Summary-wrapper__content-box-data--away'>7</div>
          </div>
          <div className='Summary-wrapper__content-box-bar'>
            <div className='Summary-wrapper__content-box-bar--home'>
              <LinearProgress
                className='Summary-wrapper__content-box-bar--home-signal'
                value={54}
                sx={{
                  '.MuiLinearProgress-bar': {
                    transform: `translateX(${100 - 46}%)!important`,
                  },
                }}
                variant='determinate'
              />
            </div>
            <div className='Summary-wrapper__content-box-bar--away'>
              <LinearProgress className='Summary-wrapper__content-box-bar--away-signal' value={46}
                variant='determinate'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
