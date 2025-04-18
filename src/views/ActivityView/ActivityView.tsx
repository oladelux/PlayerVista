import { useEffect, useState } from 'react'

import { Calendar, MessageCircle, PenLine, Search, Trophy, UserCog, UserPlus } from 'lucide-react'

import { LogType } from '@/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/services/helper'
import { logService } from '@/singletons'
import { sortApplicationLogs } from '@/utils/logs'

// Utility function to determine the appropriate icon based on the log message content
const getIconForLogMessage = (message: string) => {
  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes('add team') ||
    lowerMessage.includes('new team') ||
    lowerMessage.includes('created team')
  ) {
    return <UserPlus size={14} className='text-blue-500' />
  } else if (
    lowerMessage.includes('staff') ||
    lowerMessage.includes('coach') ||
    lowerMessage.includes('join')
  ) {
    return <UserPlus size={14} className='text-emerald-500' />
  } else if (
    lowerMessage.includes('match') ||
    lowerMessage.includes('game') ||
    lowerMessage.includes('win') ||
    lowerMessage.includes('score')
  ) {
    return <Trophy size={14} className='text-amber-500' />
  } else if (
    lowerMessage.includes('event') ||
    lowerMessage.includes('upcoming') ||
    lowerMessage.includes('date')
  ) {
    return <Calendar size={14} className='text-blue-500' />
  } else if (
    lowerMessage.includes('update') ||
    lowerMessage.includes('edit') ||
    lowerMessage.includes('change')
  ) {
    return <PenLine size={14} className='text-violet-500' />
  } else if (
    lowerMessage.includes('stat') ||
    lowerMessage.includes('analytics') ||
    lowerMessage.includes('performance')
  ) {
    return <UserCog size={14} className='text-indigo-500' />
  } else if (
    lowerMessage.includes('comment') ||
    lowerMessage.includes('message') ||
    lowerMessage.includes('chat')
  ) {
    return <MessageCircle size={14} className='text-amber-500' />
  } else {
    return <UserCog size={14} className='text-violet-500' />
  }
}

// Utility function to determine the activity type from log message
const getActivityTypeFromMessage = (message: string) => {
  const lowerMessage = message.toLowerCase()

  if (
    lowerMessage.includes('add team') ||
    lowerMessage.includes('new team') ||
    lowerMessage.includes('created team')
  ) {
    return 'team'
  } else if (lowerMessage.includes('player') || lowerMessage.includes('transfer')) {
    return 'player'
  } else if (lowerMessage.includes('staff') || lowerMessage.includes('coach')) {
    return 'staff'
  } else if (
    lowerMessage.includes('match') ||
    lowerMessage.includes('game') ||
    lowerMessage.includes('score')
  ) {
    return 'match'
  } else if (lowerMessage.includes('training') || lowerMessage.includes('practice')) {
    return 'training'
  } else if (
    lowerMessage.includes('stat') ||
    lowerMessage.includes('analytics') ||
    lowerMessage.includes('performance')
  ) {
    return 'stats'
  } else if (lowerMessage.includes('team')) {
    return 'team'
  } else {
    return 'other'
  }
}

export function ActivityView() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [activityType, setActivityType] = useState('all')
  const [logs, setLogs] = useState<LogType[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | undefined>(undefined)

  const itemsPerPage = 10

  useEffect(() => {
    const logSubscription = logService.log$.subscribe(state => {
      setLogs(state.logs)
      setLogsLoading(state.loading)
      setLogsError(state.error)
    })
    logService.getLogs()

    return () => {
      logSubscription.unsubscribe()
    }
  }, [])

  // Map logs to activity data format
  const activitiesData = sortApplicationLogs(logs).map((log, index) => {
    // Get initials from username for avatar fallback
    const initials = log.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)

    return {
      id: log.userId + '_' + index, // Using userId + index as a unique id
      avatarFallback: initials,
      title: `${log.username} ${log.message}`,
      description: formatDate(log.createdAt),
      timestamp: new Date(log.createdAt),
      icon: getIconForLogMessage(log.message),
      type: getActivityTypeFromMessage(log.message),
    }
  })

  // Filter activities based on search query and type
  const filteredActivities = activitiesData.filter(activity => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.description &&
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = activityType === 'all' || activity.type === activityType

    return matchesSearch && matchesType
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const visibleActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activityType])

  if (logsLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p className='text-xl'>Loading activities...</p>
      </div>
    )
  }

  if (logsError) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p className='text-xl text-red-500'>Error loading activities: {logsError}</p>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <Card className='mb-6'>
        <CardContent className='pt-6'>
          <div className='flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0'>
            <div className='relative flex-1'>
              <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
              <Input
                placeholder='Search activities...'
                className='pl-9'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='w-full md:w-[200px]'>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger>
                  <SelectValue placeholder='Filter by type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Activities</SelectItem>
                  <SelectItem value='player'>Players</SelectItem>
                  <SelectItem value='staff'>Staff</SelectItem>
                  <SelectItem value='match'>Matches</SelectItem>
                  <SelectItem value='training'>Training</SelectItem>
                  <SelectItem value='stats'>Statistics</SelectItem>
                  <SelectItem value='team'>Team</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-6'>
          {visibleActivities.length > 0 ? (
            <div className='space-y-4 divide-y divide-border'>
              {visibleActivities.map(activity => (
                <div key={activity.id} className='py-4 first:pt-0 last:pb-0'>
                  <div className='flex items-center space-x-4'>
                    <Avatar className='size-8'>
                      <AvatarFallback>{activity.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className='ml-2 shrink-0'>{activity.icon}</div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='text-sm font-medium'>{activity.title}</h3>
                          {activity.description && (
                            <p className='text-xs text-muted-foreground'>{activity.description}</p>
                          )}
                        </div>
                        <time className='text-xs text-muted-foreground'>
                          {activity.timestamp.toLocaleString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-6 text-center text-muted-foreground'>
              No activities found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>

      {filteredActivities.length > itemsPerPage && (
        <div className='mt-6'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {/* Simplified pagination indicator */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber: number
                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
