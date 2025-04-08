import { useState } from 'react'

import { Check, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { TeamFormData } from '@/api'
import { TeamMultiStepForm } from '@/components/team/TeamMultiStepForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useUpdates } from '@/hooks/useUpdates'
import { TeamFormValues } from '@/lib/schema/teamSchema'
import { appService, teamService } from '@/singletons'

export function CreateTeam() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showSuccess, setShowSuccess] = useState(false)
  const user = appService.getUserData()
  const logger = useUpdates()

  const handleSubmit = async (values: TeamFormValues) => {
    if (!user) {
      console.error('User not found')
      return
    }
    const data: TeamFormData = {
      ...values,
      userId: user.id,
      creationYear: new Date(values.creationYear).getFullYear().toString(),
      logo: values.logo || '',
      headCoach: values.headCoach || '',
      headCoachContact: values.headCoachContact || '',
      assistantCoach: values.assistantCoach || '',
      assistantCoachContact: values.assistantCoachContact || '',
      medicalPersonnel: values.medicalPersonnel || '',
      medicalPersonnelContact: values.medicalPersonnelContact || '',
      kitManager: values.kitManager || '',
      kitManagerContact: values.kitManagerContact || '',
      mediaManager: values.mediaManager || '',
      mediaManagerContact: values.mediaManagerContact || '',
      logisticsCoordinator: values.logisticsCoordinator || '',
      logisticsCoordinatorContact: values.logisticsCoordinatorContact || '',
      stadiumName: values.stadiumName,
      street: values.street,
      postcode: values.postcode,
      city: values.city,
      country: values.country,
      ageGroup: values.ageGroup || '',
      teamGender: values.teamGender || '',
      teamName: values.teamName,
    }
    teamService.insert(data).then(() => {
      logger.setUpdate({
        message: 'added a new team',
        userId: user.id,
        groupId: user.groupId,
      })
      logger.sendUpdates(user.groupId)
      navigate('/')
    })

    // In a real app, you'd dispatch an action or call an API here
    // For demo purposes, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    setShowSuccess(true)
    toast({
      variant: 'success',
      description: `${data.teamName} has been created and you're all set to go!`,
    })
  }

  const handleGoToDashboard = () => {
    navigate('/')
  }

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <header className='sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm'>
        <div className='container flex h-16 items-center px-4 sm:px-6'>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='size-6 text-primary' />
            <span className='text-xl font-semibold'>Team Manager</span>
          </div>
        </div>
      </header>

      <main className='flex-1 py-10'>
        <div className='container mx-auto max-w-7xl px-4'>
          {showSuccess ? (
            <Card className='mx-auto max-w-2xl border-green-100 shadow-md'>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center gap-2 text-2xl text-green-600'>
                  <Check className='size-6' />
                  Welcome to Team Manager!
                </CardTitle>
                <CardDescription>Your team has been created successfully.</CardDescription>
              </CardHeader>
              <CardContent className='pt-4'>
                <p className='mb-6 text-muted-foreground'>
                  You're all set to start managing your team. Your dashboard is ready with all the
                  tools you need to add players, schedule matches, and track performance.
                </p>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-6'>
              <div className='mx-auto mb-8 max-w-3xl text-center'>
                <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  Welcome to Team Manager
                </h1>
                <p className='mt-3 text-lg text-muted-foreground'>
                  Let's set up your first team in a few simple steps
                </p>
              </div>

              <TeamMultiStepForm onSubmit={handleSubmit} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
