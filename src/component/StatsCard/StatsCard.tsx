import { FC } from 'react'
import { TeamResult } from '../../api'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from 'recharts'

import './StatsCard.scss'

const pieData = [
  {
    subject: 'Math',
    A: 120,
  },
  {
    subject: 'Chinese',
    A: 98,
  },
  {
    subject: 'English',
    A: 86,
  },
  {
    subject: 'Geography',
    A: 99,
  },
  {
    subject: 'Physics',
    A: 85,
  },
  {
    subject: 'History',
    A: 65,
  },
]

const data = [
  {
    name: '0\'',
    GoalConceded: 2,
    GoalScored: 1,
  },
  {
    name: '10\'',
    GoalConceded: 1,
    GoalScored: 3,
  },
  {
    name: '20\'',
    GoalConceded: 4,
    GoalScored: 2,
  },
  {
    name: '30\'',
    GoalConceded: 1,
    GoalScored: 1,
  },
  {
    name: '40\'',
    GoalConceded: 2,
    GoalScored: 0,
  },
  {
    name: '50\'',
    GoalConceded: 5,
    GoalScored: 2,
  },
  {
    name: '60\'',
    GoalConceded: 1,
    GoalScored: 2,
  },
  {
    name: '70\'',
    GoalConceded: 5,
    GoalScored: 2,
  },
  {
    name: '80\'',
    GoalConceded: 3,
    GoalScored: 1,
  },
  {
    name: '90\'',
    GoalConceded: 1,
    GoalScored: 2,
  },
]

type StatsCardProps = {
  team: TeamResult | undefined
}

export const StatsCard: FC<StatsCardProps> = props => {
  return (
    <div className='Stats-card'>
      <div className='Stats-card__title'>Stats</div>
      <div className='Stats-card__header'>
        <div className='Stats-card__header-basic'>
          <img alt='team-logo' className='Stats-card__header-basic-image' src={props.team?.logo} />
          <div className='Stats-card__header-basic-title'>{props.team?.teamName}</div>
        </div>
        <div className='Stats-card__header-info'>
          <div className='Stats-card__header-info-data'>
            <div className='Stats-card__header-info-data-value'>{props.team?.players.length}</div>
            <div className='Stats-card__header-info-data-title'>Players</div>
          </div>
          <div className='Stats-card__header-info-data'>
            <div className='Stats-card__header-info-data-value'>26.9</div>
            <div className='Stats-card__header-info-data-title'>Average age</div>
          </div>
          <div className='Stats-card__header-info-data'>
            <div className='Stats-card__header-info-data-value'>26.9</div>
            <div className='Stats-card__header-info-data-title'>Average age</div>
          </div>
          <div className='Stats-card__header-info-data'>
            <div className='Stats-card__header-info-data-value'>26.9</div>
            <div className='Stats-card__header-info-data-title'>Average age</div>
          </div>
          <div className='Stats-card__header-info-data'>
            <div className='Stats-card__header-info-data-value'>26.9</div>
            <div className='Stats-card__header-info-data-title'>Average age</div>
          </div>
        </div>
      </div>
      <div className='Stats-card__content'>
        <div className='Stats-card__content-overview'>
          <div className='Stats-card__content-overview--title'>Team Overview</div>
          <div className='Stats-card__content-trends--radar-chart'>
            <ResponsiveContainer width='100%' height='100%'>
              <RadarChart cx='50%' cy='50%' outerRadius='80%' data={pieData}>
                <PolarGrid gridType='circle' radialLines={false} fill='#37003C'/>
                <PolarAngleAxis dataKey='subject' />
                <Radar
                  name='Mike'
                  dataKey='A'
                  stroke='#37003C'
                  fill='#37003C'
                  dot={{ r: 8, stroke: '#37003C', fill: '#ffffff' }}
                />
                <PolarRadiusAxis />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='Stats-card__content-trends'>
          <div className='Stats-card__content-trends--title'>Team Trends</div>
          <div className='Stats-card__content-trends--line-chart'>
            <LineChart
              width={600}
              height={350}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey='name' label={{ value: 'Minutes played', offset: -5, position: 'insideBottom' }} />
              <YAxis label={{ value: 'Goals scored/conceded', angle: -90, position: 'insideBottomLeft' }} />
              <Tooltip />
              <Legend height={4} />
              <Line
                type='monotone'
                dataKey='GoalScored'
                stroke='#8884d8'
                dot={{ stroke: '#37003C', strokeWidth: 1, r: 8 }}
                activeDot={{ stroke: '#37003C' }}
              />
              <Line
                type='natural'
                dataKey='GoalConceded'
                stroke='#82ca9d'
                strokeWidth={2} dot={{ strokeWidth: 1, r: 8 }}
                activeDot={{ stroke: '#37003C' }}
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  )
}
