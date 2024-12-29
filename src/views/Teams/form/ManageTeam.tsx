import { AuthenticatedUserData, TeamResponse } from '@/api'

interface ManageTeamProps {
  user: AuthenticatedUserData;
  teams: TeamResponse[]
}

export function ManageTeam({ user, teams }: ManageTeamProps) {
  return (
    <div>
      <h1>ManageTeam</h1>
    </div>
  )
}
