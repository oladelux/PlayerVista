import { useState } from 'react'

import { Award, Info, Target, Wand2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export interface CoachNotesFormValues {
  includeTrainingFocus: boolean
  includeCoachInsights: boolean
  includePlayerDevelopment: boolean
  trainingFocusAreas: string
  coachInsights: string
  playerDevelopmentPlan: string
}

interface PdfCoachNotesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (values: CoachNotesFormValues) => void
  defaultValues?: Partial<CoachNotesFormValues>
}

export function PdfCoachNotesModal({
  open,
  onOpenChange,
  onConfirm,
  defaultValues = {
    includeTrainingFocus: true,
    includeCoachInsights: true,
    includePlayerDevelopment: true,
    trainingFocusAreas: '',
    coachInsights: '',
    playerDevelopmentPlan: '',
  },
}: PdfCoachNotesModalProps) {
  const form = useForm<CoachNotesFormValues>({
    defaultValues,
  })
  const [isGenerating, setIsGenerating] = useState<{
    trainingFocus: boolean
    coachInsights: boolean
    playerDevelopment: boolean
  }>({
    trainingFocus: false,
    coachInsights: false,
    playerDevelopment: false,
  })

  const handleSubmit = (values: CoachNotesFormValues) => {
    onConfirm(values)
    onOpenChange(false)
  }

  // Helper to format text as bullet points
  const formatAsBulletPoints = (text: string) => {
    if (!text.trim()) return ''

    // If text already contains bullet points (•), don't modify
    if (text.includes('•')) return text

    // Otherwise, split by new lines and add bullets
    return text
      .split('\n')
      .filter(line => line.trim())
      .map(line => `• ${line.trim()}`)
      .join('\n')
  }

  // Apply formatting on blur
  const handleBlur = (field: keyof CoachNotesFormValues) => {
    const currentValue = form.getValues(field)
    if (currentValue && typeof currentValue === 'string') {
      form.setValue(field, formatAsBulletPoints(currentValue))
    }
  }

  // AI content generation for different coach notes sections
  const generateContent = async (
    field: 'trainingFocus' | 'coachInsights' | 'playerDevelopment',
  ) => {
    // Map the field to form field name
    const fieldMapping: Record<string, keyof CoachNotesFormValues> = {
      trainingFocus: 'trainingFocusAreas',
      coachInsights: 'coachInsights',
      playerDevelopment: 'playerDevelopmentPlan',
    }

    const formField = fieldMapping[field]

    // Set the loading state for the specific button
    setIsGenerating(prev => ({ ...prev, [field]: true }))

    try {
      // Here we'll simulate AI generation with mock data
      // In a real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 1000))

      let generatedContent = ''

      switch (field) {
        case 'trainingFocus':
          generatedContent =
            'Focus on first touch control in tight spaces\nImprove defensive positioning when tracking back\nWork on crossing accuracy from wide positions\nDevelop decision-making in the final third'
          break
        case 'coachInsights':
          generatedContent =
            'Shows excellent movement off the ball\nNeed to improve concentration during defensive phases\nConsistently creates scoring opportunities\nShould take more responsibility during set pieces'
          break
        case 'playerDevelopment':
          generatedContent =
            'Short-term: Master the pressing triggers in our system\nMid-term: Develop leadership qualities on the pitch\nLong-term: Become a complete two-way player\nMentality: Build resilience when facing stronger opposition'
          break
      }

      // Format and set the field value
      const formattedContent = formatAsBulletPoints(generatedContent)
      form.setValue(formField, formattedContent)

      toast({
        title: 'Content Generated',
        description: `AI content for ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} has been generated.`,
      })
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate AI content. Please try again.',
        variant: 'destructive',
      })
      console.error('AI generation error:', error)
    } finally {
      setIsGenerating(prev => ({ ...prev, [field]: false }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Add Coach Notes to PDF</DialogTitle>
          <DialogDescription>
            Add notes, insights and development plans that will be included in the exported PDF.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 pt-2'>
            {/* Training Focus Areas */}
            <FormField
              control={form.control}
              name='includeTrainingFocus'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel className='flex items-center gap-2'>
                      <Target className='size-4 text-primary' />
                      Training Focus Areas
                    </FormLabel>
                    <FormDescription>
                      Include specific training areas to focus on in the PDF.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('includeTrainingFocus') && (
              <div className='mb-6 space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='trainingFocusAreas' className='text-base font-medium'>
                    Training Focus Areas
                  </Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => generateContent('trainingFocus')}
                    disabled={isGenerating.trainingFocus}
                    className='flex items-center gap-1.5'
                  >
                    <Wand2 className='size-3.5' />
                    {isGenerating.trainingFocus ? 'Generating...' : 'Auto Generate'}
                  </Button>
                </div>
                <Textarea
                  id='trainingFocusAreas'
                  placeholder='Enter specific training areas to focus on (each line will become a bullet point)'
                  rows={4}
                  {...form.register('trainingFocusAreas')}
                  onBlur={() => handleBlur('trainingFocusAreas')}
                  className='min-h-[100px]'
                />
                <p className='text-xs text-muted-foreground'>
                  List specific training drills, exercises, or areas the player should focus on to
                  improve.
                </p>
              </div>
            )}

            {/* Coach's Insights */}
            <FormField
              control={form.control}
              name='includeCoachInsights'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel className='flex items-center gap-2'>
                      <Info className='size-4 text-primary' />
                      Coach's Insights
                    </FormLabel>
                    <FormDescription>
                      Include your observations and insights about the player in the PDF.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('includeCoachInsights') && (
              <div className='mb-6 space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='coachInsights' className='text-base font-medium'>
                    Coach's Insights
                  </Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => generateContent('coachInsights')}
                    disabled={isGenerating.coachInsights}
                    className='flex items-center gap-1.5'
                  >
                    <Wand2 className='size-3.5' />
                    {isGenerating.coachInsights ? 'Generating...' : 'Auto Generate'}
                  </Button>
                </div>
                <Textarea
                  id='coachInsights'
                  placeholder="Enter your insights about the player's performance (each line will become a bullet point)"
                  rows={4}
                  {...form.register('coachInsights')}
                  onBlur={() => handleBlur('coachInsights')}
                  className='min-h-[100px]'
                />
                <p className='text-xs text-muted-foreground'>
                  Share your observations about the player's strengths, weaknesses, and areas of
                  growth.
                </p>
              </div>
            )}

            {/* Player Development Plan */}
            <FormField
              control={form.control}
              name='includePlayerDevelopment'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel className='flex items-center gap-2'>
                      <Award className='size-4 text-primary' />
                      Player Development Plan
                    </FormLabel>
                    <FormDescription>
                      Include development goals and plans for the player in the PDF.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch('includePlayerDevelopment') && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='playerDevelopmentPlan' className='text-base font-medium'>
                    Player Development Plan
                  </Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => generateContent('playerDevelopment')}
                    disabled={isGenerating.playerDevelopment}
                    className='flex items-center gap-1.5'
                  >
                    <Wand2 className='size-3.5' />
                    {isGenerating.playerDevelopment ? 'Generating...' : 'Auto Generate'}
                  </Button>
                </div>
                <Textarea
                  id='playerDevelopmentPlan'
                  placeholder='Enter development goals or milestones (each line will become a bullet point)'
                  rows={4}
                  {...form.register('playerDevelopmentPlan')}
                  onBlur={() => handleBlur('playerDevelopmentPlan')}
                  className='min-h-[100px]'
                />
                <p className='text-xs text-muted-foreground'>
                  Outline short and long-term development goals, milestones, and career progression
                  plans.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit'>Generate PDF</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
