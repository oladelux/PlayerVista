import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { Fixtures, TeamResult } from '../../api'

import { DashboardLayout } from '../../component/DashboardLayout/DashboardLayout'
import { Card } from '../../component/Card/Card'
import { UpcomingMatch } from '../../component/UpcomingMatch/UpcomingMatch'
import { StatsCard } from '../../component/StatsCard/StatsCard'
import { PlayerMetrics } from '../../component/PlayerMetrics/PlayerMetrics'
import { Update } from '../../component/Update/Update'

import './Dashboard.scss'

type DashboardProps = {
  teamResult: Fixtures[]
  teams: TeamResult[]
}

export const Dashboard: FC<DashboardProps> = props => {
  const { teamId } = useParams()
  const currentTeam = props.teams.find((team) => team.id === teamId)
  return (
    <DashboardLayout>
      <div className='Dashboard'>
        <div className='Dashboard__content'>
          <Card className='Dashboard__content-first'>
            <Update />
          </ Card>
          <Card className='Dashboard__content-second'>
            <UpcomingMatch />
          </Card>
        </div>
        <div className='Dashboard__section'>
          <Card className='Dashboard__section-card'>
            <StatsCard team={currentTeam} />
          </Card>
          <Card className='Dashboard__section-card'>
            <PlayerMetrics team={currentTeam} />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
