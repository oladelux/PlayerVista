import { Video } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { VideoPlayer } from './VideoPlayer'

interface StatWithVideoProps {
  title: string
  value: number | string
  unit?: string
  videos?: Array<{ id: number; title: string; url: string; thumbnail?: string }>
}

export function StatWithVideo({ title, value, unit = '', videos = [] }: StatWithVideoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className='cursor-pointer transition-colors hover:bg-accent/50'>
          <CardContent className='flex flex-col items-center justify-center p-4 text-center'>
            <p className='text-sm text-muted-foreground'>{title}</p>
            <p className='text-xl font-bold'>
              {value}
              {unit}
            </p>
            {videos && videos.length > 0 && (
              <div className='mt-2 flex items-center gap-1 text-xs text-primary'>
                <Video size={12} />
                <span>{videos.length} videos</span>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>
            {title} - {value}
            {unit}
          </DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          {videos && videos.length > 0 ? (
            <VideoPlayer videos={videos} title={title} />
          ) : (
            <div className='py-8 text-center text-muted-foreground'>
              No videos available for this stat
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
