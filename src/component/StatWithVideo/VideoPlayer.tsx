import { useState } from 'react'

import { Play } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'

interface Video {
  id: number
  title: string
  url: string
  thumbnail?: string
}

interface VideoPlayerProps {
  videos: Array<Video>
  title: string
}

export function VideoPlayer({ videos, title }: VideoPlayerProps) {
  const [activeVideo, setActiveVideo] = useState<Video>(videos[0])

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>{title} Highlights</h3>

      {activeVideo ? (
        <div className='relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-black'>
          <div className='text-white'>Video would play here: {activeVideo.title}</div>
          <Play className='absolute size-16 text-white opacity-50' />
        </div>
      ) : (
        <div className='flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted'>
          <p className='text-muted-foreground'>No videos available</p>
        </div>
      )}

      {videos.length > 1 && (
        <ScrollArea className='h-24 whitespace-nowrap'>
          <div className='flex gap-2 py-2'>
            {videos.map(video => (
              <div
                key={video.id}
                className={`aspect-video w-32 cursor-pointer overflow-hidden rounded-md border-2 ${activeVideo?.id === video.id ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setActiveVideo(video)}
              >
                <div className='relative flex size-full items-center justify-center bg-muted'>
                  <span className='truncate px-2 text-xs text-muted-foreground'>{video.title}</span>
                  <Play className='absolute size-6 text-muted-foreground opacity-70' />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
