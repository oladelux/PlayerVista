import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  type: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
}
export default function LoadingButton({
  isLoading,
  type,
  children,
  className,
  onClick,
}: LoadingButtonProps) {
  return (
    <Button className={className} disabled={isLoading} type={type} onClick={onClick}>
      {isLoading && <Loader2 className='animate-spin' />}
      {children}
    </Button>
  )
}
