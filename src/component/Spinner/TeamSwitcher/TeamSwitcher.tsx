import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import * as React from 'react'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { TeamResponse } from '@/api'
import { Avatar,
  AvatarFallback,
  AvatarImage } from '@/components/ui/avatar.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator } from '@/components/ui/command.tsx'
import { Popover,
  PopoverContent,
  PopoverTrigger } from '@/components/ui/popover'
import { routes } from '@/constants/routes.ts'
import { cn } from '@/lib/utils'
import { appService } from '@/singletons'
import { getEventsByTeamThunk } from '@/store/slices/EventsSlice.ts'
import { getPlayersByTeamIdThunk } from '@/store/slices/PlayersSlice.ts'
import { setActiveTeamId } from '@/store/slices/SettingsSlice.ts'
import { getStaffsThunk } from '@/store/slices/StaffSlice.ts'
import { AppDispatch } from '@/store/types.ts'
import { toLocalSession } from '@/utils/localSession.ts'
import { setCurrentTeam } from '@/utils/localStorage.ts'
import { SessionInstance } from '@/utils/SessionInstance.ts'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {
  teams: TeamResponse[]
}

export default function TeamSwitcher({ className, teams }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const activeTeamId = SessionInstance.getTeamId()
  const activeTeam = teams.find((team) => team.id === activeTeamId)
  const [selectedTeam, setSelectedTeam] = React.useState<TeamResponse | undefined>(activeTeam)
  const dispatch = useDispatch<AppDispatch>()
  const userData = appService.getUserData()

  const handleTeamChange = useCallback( async (team: TeamResponse) => {
    toLocalSession({ currentTeamId: team.id })
      .then(() => {
        setSelectedTeam(team)
        setOpen(false)
        window.location.reload()
      })
      .catch(e => console.error('Error setting current team id:', e))
    appService.setActiveTeam(team.id)
    setCurrentTeam(team.id)
    dispatch(setActiveTeamId({ teamId: team.id }))
    dispatch(getPlayersByTeamIdThunk({ teamId: team.id }))
    dispatch(getEventsByTeamThunk({ teamId: team.id }))
    userData && dispatch(getStaffsThunk({ groupId: userData.groupId }))
  }, [dispatch, userData])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-label='Select a team'
          className={cn('w-[200px] justify-between', className)}
        >
          <Avatar className='mr-2 size-5'>
            <AvatarImage
              src={selectedTeam?.logo}
              alt={selectedTeam?.teamName}
              className='grayscale'
            />
            <AvatarFallback>{selectedTeam?.teamName.charAt(0)}</AvatarFallback>
          </Avatar>
          {selectedTeam?.teamName}
          <ChevronsUpDown className='ml-auto opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search team...' />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup heading='Teams' />
            {teams.map((team) => (
              <CommandItem
                key={team.id}
                onSelect={() => {
                  handleTeamChange(team)
                }}
                className='text-sm'
              >
                <Avatar className='mr-2 size-5'>
                  <AvatarImage
                    src={team.logo}
                    alt={team.teamName}
                    className='grayscale'
                  />
                  <AvatarFallback>{team?.teamName.charAt(0)}</AvatarFallback>
                </Avatar>
                {team.teamName}
                <Check
                  className={cn(
                    'ml-auto',
                    selectedTeam?.teamName === team.teamName
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <Link to={routes.dashboardCreateTeam} className='flex gap-x-2 p-2 text-sm'>
                <PlusCircle className='size-5' />
                Create Team
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
