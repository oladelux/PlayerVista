import { useTeam } from '@/hooks/useTeam.ts'
import { usePlayer } from '@/hooks/usePlayer.ts'

type ProfileTeamImageProps = {
  playerId: string | undefined
  teamId: string | undefined
}

export default function ProfileTeamImage({ playerId, teamId }: ProfileTeamImageProps) {
  const { team } = useTeam(teamId)
  const { player } = usePlayer(playerId)

  if(!team || !player) {
    return null
  }
  return (
    <div className='grid grid-cols-2 gap-3'>
      <div className='w-28 h-28 bg-gray-200 rounded-full grid items-center p-2 justify-center overflow-hidden'>
        <img className='max-w-full h-auto' src={player.imageSrc} alt={player.firstName}/>
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
