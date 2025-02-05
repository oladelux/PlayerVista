import { useOutletContext } from 'react-router-dom'

import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { usePlayer } from '@/hooks/usePlayer.ts'

type ProfileTeamImageProps = {
  playerId: string | undefined
  teamId: string | undefined
}

export default function ProfileTeamImage({ playerId, teamId }: ProfileTeamImageProps) {
  const { teams } = useOutletContext<DashboardLayoutOutletContext>()
  const team = teams.find(team => team.id === teamId)
  const { player } = usePlayer(playerId)

  if(!team || !player) {
    return null
  }
  return (
    <div className='grid grid-cols-2 gap-3'>
      <div className='grid size-28 items-center justify-center overflow-hidden rounded-full bg-gray-200 p-2'>
        <img className='h-auto max-w-full' src={player.imageSrc} alt={player.firstName}/>
      </div>
      <div className='flex flex-col justify-center'>
        <p className='text-[20px] leading-4'>{player.firstName}</p>
        <p className='text-[29px] font-bold'>{player.lastName}</p>
        <div className='flex items-center gap-2'>
          <img src={team.logo} alt='team_logo' width={23} />
          <p className='text-xs text-at-grey'>{team.teamName}</p>
        </div>
      </div>
    </div>
  )
}
