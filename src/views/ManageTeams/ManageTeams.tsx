import { useState } from 'react'

import { Plus, Search, Star } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'

import { DashboardLayoutOutletContext } from '@/component/DashboardLayout/DashboardLayout'
import { LoadingPage } from '@/component/LoadingPage/LoadingPage'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { usePermission } from '@/hooks/usePermission'
import { usePlayer } from '@/hooks/usePlayer'
import { SessionInstance } from '@/utils/SessionInstance'

// Helper function to generate avatar text from team name
const getAvatarText = (teamName: string) => {
  if (!teamName) return ''

  const words = teamName.split(' ')
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase()
  } else {
    return words
      .map(word => word[0])
      .join('')
      .substring(0, 3)
      .toUpperCase()
  }
}

export function ManageTeams() {
  const { canCreateTeam } = usePermission()
  const teamId = SessionInstance.getTeamId()
  const {
    teams,
    teamsError: error,
    teamsLoading: loading,
  } = useOutletContext<DashboardLayoutOutletContext>()
  const {
    allUserPlayers: players,
    loading: playersLoading,
    error: playersError,
  } = usePlayer(undefined, teamId)

  const [searchQuery, setSearchQuery] = useState('')

  if (loading || playersLoading) return <LoadingPage />
  if (error || playersError) return 'This is an error page'

  // Filter teams based on search query
  const filteredTeams = teams.filter(team =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className='animate-fade-in space-y-6 bg-white p-4 md:p-6'>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='w-full space-y-2 sm:w-auto'>
          <h2 className='text-xl font-semibold'>All Teams</h2>
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Search teams...'
              className='pl-8'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {canCreateTeam && (
          <Button asChild className='flex items-center gap-1.5'>
            <Link to='/add-team'>
              <Plus size={16} />
              Add New Team
            </Link>
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {filteredTeams.map(team => {
          const teamPlayers = players.filter(player => player.teamId === team.id)

          return (
            <Card key={team.id} className='card-hover overflow-hidden'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='size-12'>
                      <AvatarFallback className='bg-primary text-primary-foreground'>
                        {getAvatarText(team.teamName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='font-semibold'>{team.teamName}</h3>
                      <div className='mt-1 flex items-center gap-2'>
                        <Badge variant='outline' className='text-xs font-normal'>
                          {team.ageGroup || 'Team'}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {teamPlayers.length} players
                        </span>
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {team.city}, {team.country}
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon' className='text-muted-foreground'>
                    <Star size={16} />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between bg-muted/50 px-6 py-3'>
                <Button variant='outline' size='sm' asChild>
                  <Link to={`/team-stats/${team.id}`}>View Stats</Link>
                </Button>
                <Button variant='outline' size='sm' asChild>
                  <Link to={`/${team.id}/manage-team`}>Manage</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}

        {filteredTeams.length === 0 && (
          <div className='col-span-full flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-4 rounded-full bg-muted p-3'>
              <Search className='size-6 text-muted-foreground' />
            </div>
            <h3 className='mb-1 text-lg font-medium'>No teams found</h3>
            <p className='max-w-xs text-sm text-muted-foreground'>
              {searchQuery
                ? 'No teams matching your search criteria. Try a different search term.'
                : "You don't have any teams yet. Create your first team to get started."}
            </p>
            {canCreateTeam && searchQuery === '' && (
              <Button asChild className='mt-4'>
                <Link to='/add-team'>
                  <Plus className='mr-2 size-4' />
                  Add New Team
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
