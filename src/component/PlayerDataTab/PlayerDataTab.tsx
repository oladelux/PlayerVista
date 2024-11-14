import { PlayerActions } from '@/api'
import { groupActionsByCategory, PhaseActions } from '@/utils/phaseMetrics.ts'

interface PlayerDataTabProps {
  actions: PlayerActions | null
  metrics: PhaseActions[]
}
export default function PlayerDataTab({ actions, metrics }: PlayerDataTabProps) {
  if(!actions) return (
    <div className='flex justify-center items-center bg-card-stat-bg py-5 px-6 rounded-md'>
      <div className='text-sub-text text-xs text-text-grey-1'>No data</div>
    </div>
  )
  const playerActions = groupActionsByCategory(actions, metrics)

  return (
    <div className='grid grid-cols-3 gap-5'>
      {playerActions.map(action => (
        <div key={action.label} className='flex justify-between items-center bg-card-stat-bg py-5 px-6 rounded-md'>
          <div className='text-sub-text text-xs text-text-grey-1'>{action.label}</div>
          <div className='text-xs p-2.5 bg-white rounded-lg border-b'
            style={{
              color: `${action.color}`,
              borderBottomColor: `${action.color}`,
            }}>
            {action.data.length}
          </div>
        </div>
      ))}
    </div>
  )
}
