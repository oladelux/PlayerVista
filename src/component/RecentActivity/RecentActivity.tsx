import { useMemo } from 'react'

import { ArrowRight, Clock, MessageCircle, UserPlus } from 'lucide-react'

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

  // Map your log data to the format expected by ActivityItem
  const activitiesData = sortedApplicationLogs.map((log, index) => {
    // Get initials from username for avatar fallback
    const initials = log.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)

    // Choose an icon based on some logic (you can customize this)
    const getIcon = () => {
      // This is just an example - you might want to derive icons based on log message content
      const icons = [
        <UserPlus key='user' size={14} className='text-emerald-500' />,
        <MessageCircle key='message' size={14} className='text-amber-500' />,
        <Clock key='clock' size={14} className='text-blue-500' />,
      ]
      return icons[index % icons.length]
    }

    return {
      id: index,
      avatarFallback: initials,
      title: `${log.username} ${log.message}`,
      description: formatDate(log.createdAt),
      timestamp: new Date(log.createdAt),
      icon: getIcon(),
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
          {activitiesData.slice(0, 5).map(activity => (
            <ActivityItem
              key={activity.id}
              avatarFallback={activity.avatarFallback}
              title={activity.title}
              description={activity.description}
              timestamp={activity.timestamp}
              icon={activity.icon}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className='pt-3'>
        <Button variant='ghost' className='w-full justify-between' asChild>
          <a href='#'>
            View all activity
            <ArrowRight size={16} />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
