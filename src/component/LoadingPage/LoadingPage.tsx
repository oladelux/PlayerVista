import { Loader2 } from 'lucide-react'


export interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <div className='flex h-dvh w-full items-center justify-center'>
      <div className='grid grid-rows-2 items-center justify-center w-full place-items-center gap-3'>
        <Loader2 className='animate-spin stroke-dark-blue' size={44} />
        {message && <p className='font-bold text-sm my-0 py-0 text-dark-purple'>{message}</p>}
      </div>
    </div>
  )
}
