import { useMemo } from 'react'

import {
  ArrowRight,
  Calendar,
  MessageCircle,
  PenLine,
  Trophy,
  UserCog,
  UserPlus,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { LogType } from '@/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/services/helper'
import { sortApplicationLogs } from '@/utils/logs'

type ActivityItemProps = {
  avatarFallback: string
  title: string
  description: string
  timestamp: Date
  icon: React.ReactNode
}

const ActivityItem = ({
  avatarFallback,
  title,
  description,
  timestamp,
  icon,
}: ActivityItemProps) => {
  // Format relative time (e.g., "30 minutes ago")
  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <div className='flex items-center py-2'>
      <Avatar className='size-8'>
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className='ml-4 space-y-1'>
        <p className='text-sm font-medium leading-none'>{title}</p>
        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
      </div>
      <div className='ml-auto flex flex-col items-end gap-1'>
        <span className='flex items-center gap-1 text-xs text-muted-foreground'>
          {icon}
          {getRelativeTime(timestamp)}
        </span>
      </div>
    </div>
  )
}

type RecentActivityProps = {
  applicationLogs: LogType[]
}

export function RecentActivity({ applicationLogs }: RecentActivityProps) {
  const sortedApplicationLogs = useMemo(
    () => sortApplicationLogs(applicationLogs),
    [applicationLogs],
  )

  // Determine the appropriate icon based on the log message content
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

  // Map the actual logs to the format expected by ActivityItem
  const activitiesData = sortedApplicationLogs.map((log, index) => {
    // Get initials from username for avatar fallback
    const initials = log.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)

    return {
      id: index,
      avatarFallback: initials,
      title: `${log.username} ${log.message}`,
      description: formatDate(log.createdAt),
      timestamp: new Date(log.createdAt),
      icon: getIconForLogMessage(log.message),
    }
  })

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle>Recent Updates</CardTitle>
        <CardDescription>Latest actions and updates across your teams</CardDescription>
      </CardHeader>
      <CardContent className='pb-1'>
        <div className='space-y-1 divide-y divide-border'>
          {activitiesData.length > 0 ? (
            activitiesData
              .slice(0, 5)
              .map(activity => (
                <ActivityItem
                  key={activity.id}
                  avatarFallback={activity.avatarFallback}
                  title={activity.title}
                  description={activity.description}
                  timestamp={activity.timestamp}
                  icon={activity.icon}
                />
              ))
          ) : (
            <p className='py-4 text-center text-sm text-muted-foreground'>
              No recent activity to display
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className='pt-3'>
        <Button variant='ghost' className='w-full justify-between' asChild>
          <Link to='/activity'>
            View all activity
            <ArrowRight size={16} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
