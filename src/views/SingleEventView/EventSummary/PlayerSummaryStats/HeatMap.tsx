/*
import { FC } from 'react'
import {
  ReferenceArea,
  ReferenceDot,
  ReferenceLine, Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { HeatSectorsType, LocationData } from '@/utils/players.ts'

import { Column, Table } from '@/component/Table/Table.tsx'

type HeatMapProps = {
  playerLocations: LocationData[]
  heatSectors: HeatSectorsType[]
  summaryStatsColumns: Column[]
  teamPlayers: {select: string, num: number, position: string, name: string}[]
}

const scale = 4

export const HeatMap: FC<HeatMapProps> = ({
  playerLocations,
  heatSectors,
  summaryStatsColumns,
  teamPlayers,
}) => {

  return (
    <>
      <div className='Heat-map__title'>Heat Map</div>
      <div className='Heat-map__wrapper'>
        <div className='Heat-map__wrapper-field'>
          <div className='Heat-map__wrapper-field-chart'>
            <ScatterChart
              width={80 * scale}
              height={120 * scale}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <ReferenceDot y={12} x={40} r={10 * scale} fill='#006400' stroke='white'/>
              <ReferenceDot y={60} x={40} r={10 * scale} fill='#006400' stroke='white'/>
              <ReferenceDot y={108} x={40} r={10 * scale} fill='#006400' stroke='white'/>
              <ReferenceArea y1={0} y2={18} x1={18} x2={80 - 18} fill='#006400' fillOpacity={1} stroke='white'/>
              <ReferenceArea y1={102} y2={120} x1={18} x2={80 - 18} fill='#006400' fillOpacity={1} stroke='white'/>
              <ReferenceArea y1={0} y2={6} x1={30} x2={80 - 30} fill='#006400' fillOpacity={1} stroke='white'/>
              <ReferenceArea y1={114} y2={120} x1={30} x2={80 - 30} fill='#006400' fillOpacity={1} stroke='white'/>
              <ReferenceDot y={60} x={40} r={0.5 * scale} fill='black' stroke='white'/>
              <ReferenceDot y={12} x={40} r={0.5 * scale} fill='black' stroke='white'/>
              <ReferenceDot y={108} x={40} r={0.5 * scale} fill='black' stroke='white'/>
              {
                heatSectors && heatSectors.map((sector, index) => (
                  <ReferenceArea
                    key={index}
                    y1={sector.x1}
                    y2={sector.x2}
                    x1={sector.y1}
                    x2={sector.y2}
                    fill='yellow'
                    fillOpacity={(sector.count / 100) * 1.3}
                    stroke='white'
                    strokeOpacity={0}
                  />
                ))
              }
              <ReferenceLine y={60} stroke='white'/>
              <ReferenceArea y1={0} y2={0.1} x1={36} x2={80 - 36} fill='black' fillOpacity={1} stroke='white'/>
              <ReferenceArea y1={119.9} y2={120} x1={36} x2={80 - 36} fill='black' fillOpacity={1} stroke='white'/>
              <ReferenceArea x1={0} x2={80} y1={0} y2={120} fillOpacity={0} fill='black' stroke='white'/>
              <XAxis type='number' dataKey='y' hide domain={[0, 80]} />
              <YAxis type='number' dataKey='x' hide domain={[0, 120]}/>
              <Tooltip cursor={{ strokeDasharray: '3 3' }}/>
              <Scatter name='Heatmap' data={playerLocations} fill='yellow' />
            </ScatterChart>
          </div>
        </div>
        <div className='Heat-map__wrapper-players'>
          <Table columns={summaryStatsColumns} data={teamPlayers}/>
        </div>
      </div>
    </>
  )
}
*/
