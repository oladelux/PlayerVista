import { Loader2 } from 'lucide-react'

export interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <div className='flex h-dvh w-full items-center justify-center'>
      <div className='grid w-full grid-rows-2 place-items-center justify-center gap-3'>
        <Loader2 className='animate-spin stroke-dark-blue' size={44} />
        {message && <p className='my-0 py-0 text-sm font-bold text-dark-purple'>{message}</p>}
      </div>
    </div>
  )
}
