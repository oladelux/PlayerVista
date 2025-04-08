import { useState } from 'react'

import { ChevronLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { TeamFormData } from '@/api'
import { TeamMultiStepForm } from '@/components/team/TeamMultiStepForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useUpdates } from '@/hooks/useUpdates'
import { TeamFormValues } from '@/lib/schema/teamSchema'
import { appService, teamService } from '@/singletons'

export function DashboardCreateTeam() {
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
      navigate('/teams')
    })

    setShowSuccess(true)
    toast({
      variant: 'success',
      description: `${data.teamName} has been added to your organization`,
    })
  }

  const handleReturnToTeams = () => {
    navigate('/teams')
  }

  return (
    <div className='container mx-auto max-w-7xl px-4 py-6'>
      <div className='mt-8'>
        {showSuccess ? (
          <Card className='mx-auto max-w-2xl border-green-100 shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-2 text-2xl text-green-600'>
                <ShieldCheck className='size-6' />
                Team Created Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-4'>
              <p className='mb-6 text-muted-foreground'>
                Your new team has been created and is ready to go. You can now add players, staff,
                and manage team activities.
              </p>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button onClick={handleReturnToTeams} className='flex items-center gap-2'>
                  <ChevronLeft className='size-4' />
                  Return to Teams
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <TeamMultiStepForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  )
}
