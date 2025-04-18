import { soccerBall } from '@lucide/lab'
import { motion } from 'framer-motion'
import { Activity, ArrowLeft, Home, Icon, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

import PlayerVistaLogo from '@/assets/images/icons/playervista.png'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NotFound() {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4'>
      {/* Background football pattern */}
      <div className='absolute inset-0 z-0 opacity-5'>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className='absolute size-16 rounded-full border-2 border-primary'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: Math.random() * 20 - 10,
              y: Math.random() * 20 - 10,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 8 + Math.random() * 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='z-10 w-full max-w-md text-center'
      >
        <div className='mb-6 flex justify-center'>
          <img src={PlayerVistaLogo} alt='playervista' width={150} />
        </div>

        <Card className='mb-8 border-primary/20 bg-background/90 p-6 backdrop-blur-sm'>
          <div className='relative mb-8 flex justify-center'>
            <div className='pointer-events-none absolute select-none opacity-10'>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className='select-none text-[200px] font-extrabold leading-none'
              >
                404
              </motion.div>
            </div>

            <div className='flex flex-col items-center justify-center gap-2'>
              <div className='flex size-24 items-center justify-center rounded-full bg-red-500'>
                <Icon iconNode={soccerBall} className='size-12 text-white' />
              </div>
              <Trophy className='absolute -top-10 right-0 size-16 rotate-12 text-amber-400' />
              <Activity className='absolute bottom-0 left-0 size-10 -rotate-12 text-primary' />
            </div>
          </div>

          <h1 className='mb-3 text-4xl font-bold text-primary'>Offside!</h1>

          <p className='mb-6 text-muted-foreground'>
            The page you're looking for is out of bounds. It might have been moved, deleted, or
            never existed.
          </p>

          <Alert variant='destructive' className='mb-6 bg-background/50'>
            <Icon iconNode={soccerBall} className='size-4' />
            <AlertTitle>Page Not Found</AlertTitle>
            <AlertDescription>Let's get you back in the game.</AlertDescription>
          </Alert>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild variant='outline' size='lg' className='gap-2'>
              <Link to='/'>
                <Home className='size-4' />
                Back to Home
              </Link>
            </Button>

            <Button asChild size='lg' className='gap-2'>
              <Link to='/dashboard'>
                <ArrowLeft className='size-4' />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className='mt-8 rounded-lg border border-border/50 bg-muted/30 p-4'
        >
          <p className='text-sm text-muted-foreground'>
            Need help finding something? Contact our{' '}
            <Link to='#' className='text-primary hover:underline'>
              support team
            </Link>{' '}
            for assistance.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
