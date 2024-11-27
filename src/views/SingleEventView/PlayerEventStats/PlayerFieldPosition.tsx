import { FC } from 'react'
import {
  ReferenceArea,
  ReferenceDot,
  ReferenceLine, Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts'
import { PlayerPositionType, positionData } from '@/utils/players.ts'

import ShirtIcon from '@/assets/images/shirt.png'

type PlayerFieldPositionProps = {
  position: string
}

const scale = 4

export const PlayerFieldPosition: FC<PlayerFieldPositionProps> = ({
  position,
}) => {
  const playerPosition = positionData[position as PlayerPositionType]

  return (
    <>
      <div className='flex justify-center'>
        <div className='my-5'>
          <div className='bg-[#3C8031]'>
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
              <ReferenceLine y={60} stroke='white'/>
              <ReferenceArea y1={0} y2={0.1} x1={36} x2={80 - 36} fill='black' fillOpacity={1} stroke='white'/>
              <ReferenceArea y1={119.9} y2={120} x1={36} x2={80 - 36} fill='black' fillOpacity={1} stroke='white'/>
              <ReferenceArea x1={0} x2={80} y1={0} y2={120} fillOpacity={0} fill='black' stroke='white'/>
              <XAxis type='number' dataKey='y' hide domain={[0, 80]} />
              <YAxis type='number' dataKey='x' hide domain={[0, 120]}/>
              <Scatter name='Heatmap' data={[playerPosition]} fill='yellow' shape={<CustomImage />} />
            </ScatterChart>
          </div>
        </div>
      </div>
    </>
  )
}

const CustomImage = (props: any) => {
  const { cx, cy } = props
  return (
    <image
      x={cx - 10}
      y={cy - 10}
      width={30}
      height={30}
      href={ShirtIcon}
    />
  )
}
