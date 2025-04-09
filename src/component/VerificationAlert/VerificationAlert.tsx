import { AlertCircle, X } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface VerificationAlertProps {
  onDismiss: () => void
  onResend: () => void
}

export function VerificationAlert({ onDismiss, onResend }: VerificationAlertProps) {
  const { toast } = useToast()

  const handleResendVerification = () => {
    onResend()
    toast({
      title: 'Verification email sent',
      description: 'Please check your inbox and spam folder',
    })
  }

  return (
    <Alert className='relative mb-6 border-amber-200 bg-amber-50 text-amber-800'>
      <AlertCircle className='size-5 text-amber-800' />
      <div className='flex-1'>
        <AlertTitle className='font-medium text-amber-800'>Email verification required</AlertTitle>
        <AlertDescription className='text-amber-700'>
          <p className='mb-2'>Please verify your email address to access all features.</p>
          <Button
            variant='outline'
            size='sm'
            className='mr-2 border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'
            onClick={handleResendVerification}
          >
            Resend verification email
          </Button>
        </AlertDescription>
      </div>
      <Button
        variant='ghost'
        size='sm'
        className='absolute right-2 top-2 text-amber-700 hover:bg-amber-100 hover:text-amber-900'
        onClick={onDismiss}
      >
        <X className='size-4' />
      </Button>
    </Alert>
  )
}
