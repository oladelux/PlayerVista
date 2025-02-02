import { PlayerActions } from '@/api'
import { groupActionsByCategory, PhaseActions } from '@/utils/phaseMetrics.ts'

interface PlayerDataTabProps {
  actions: PlayerActions | null
  metrics: PhaseActions[]
}
export default function PlayerDataTab({ actions, metrics }: PlayerDataTabProps) {
  if(!actions) return (
    <div className='flex items-center justify-center rounded-md bg-card-stat-bg px-6 py-5'>
      <div className='text-xs text-sub-text text-text-grey-1'>No data</div>
    </div>
  )
  const playerActions = groupActionsByCategory(actions, metrics)

  return (
    <div className='grid grid-cols-3 gap-5'>
      {playerActions.map(action => (
        <div key={action.label} className='flex items-center justify-between rounded-md bg-card-stat-bg px-6 py-5'>
          <div className='text-xs text-sub-text text-text-grey-1'>{action.label}</div>
          <div className='rounded-lg border-b bg-white p-2.5 text-xs'
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
