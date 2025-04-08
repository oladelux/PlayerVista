import { PlayerActions } from '@/api'
import { groupActionsByCategory, PhaseActions } from '@/utils/phaseMetrics.ts'

import { StatWithVideo } from '../StatWithVideo/StatWithVideo'

interface PlayerDataTabProps {
  actions: PlayerActions | null
  metrics: PhaseActions[]
}
export default function PlayerDataTab({ actions, metrics }: PlayerDataTabProps) {
  if (!actions)
    return (
      <div className='flex items-center justify-center rounded-md bg-card-stat-bg px-6 py-5'>
        <div className='text-xs text-sub-text'>No data</div>
      </div>
    )
  const playerActions = groupActionsByCategory(actions, metrics)

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
      {playerActions.map(action => (
        <StatWithVideo
          key={action.label}
          title={action.label}
          value={action.data.length}
          videos={[]}
        />
      ))}
    </div>
  )
}
