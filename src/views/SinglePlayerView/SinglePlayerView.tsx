import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'

import './SinglePlayerView.scss'
import { TabButton } from '../../component/TabButton/TabButton'
import { TabContent } from '../../component/TabContent/TabContent'
import { players } from '../../config/constants'
import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'

const playersViewCategories = ['overview', 'stats', 'report']

export const SinglePlayerView: FC = () => {
  const { playerId } = useParams()
  const playerData = players.find(player => player.id === Number(playerId))
  const playerFullName = playerData && playerData.name.split(' ')
  const firstName = playerFullName && playerFullName[0]
  const lastName = playerFullName && playerFullName.slice(1).join(' ')

  const [selectedTab, setSelectedTab] = useState('')
  const activeTab = selectedTab || playersViewCategories[0]
  return (
    <DashboardLayout>
      <div className='single-player-view'>
        <div className='single-player-view__header'>
          <div className='single-player-view__header-player'>
            <div className='single-player-view__header-player--media'>
              <img className='single-player-view__header-player--media-img' src={playerData && playerData.imgSrc}/>
              <div className='single-player-view__header-player--media-name'>
                <span className='single-player-view__header-player--media-name-fn'>{firstName}</span><br />
                <span className='single-player-view__header-player--media-name-ln'>{lastName}</span>
              </div>
            </div>
            <div className='single-player-view__header-player--number'>
              {playerData && playerData.number}
            </div>
          </div>
          <div className='single-player-view__header-tabs'>
            {playersViewCategories.map(category => {
              return (
                <TabButton
                  key={category}
                  isActive={activeTab === category}
                  onClick={() => setSelectedTab(category)}
                  className='single-player-view__header-tabs-category'
                >
                  {category}
                </TabButton>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
