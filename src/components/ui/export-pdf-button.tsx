import { useState } from 'react'

import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PdfTypeEnum } from '@/config/PdfType'
import { useToast } from '@/hooks/use-toast'
import { generatePdf, PdfExportOptions } from '@/utils/pdfGenerator'

import { CoachNotesFormValues, PdfCoachNotesModal } from './pdf-coach-notes-modal'

export interface ExportPdfButtonProps {
  options: {
    title: string
    subtitle?: string
    content?: string
    data?: unknown
    filename?: string
    exportType: PdfTypeEnum
    templateName?: string
    includeImages?: boolean
    footerText?: string
    playerId?: string // Player ID for fetching real data
    eventId?: string // Event ID for match reports
  }
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined
  className?: string
  style?: React.CSSProperties
  customLabel?: string
  disabled?: boolean
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  options,
  variant = 'outline',
  size = 'sm',
  className = '',
  style,
  customLabel,
  disabled = false,
}) => {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [coachNotes, setCoachNotes] = useState<CoachNotesFormValues>({
    includeTrainingFocus: true,
    includeCoachInsights: true,
    includePlayerDevelopment: true,
    trainingFocusAreas: '',
    coachInsights: '',
    playerDevelopmentPlan: '',
  })

  const handleExport = async () => {
    setIsModalOpen(true)
  }

  const handleConfirmCoachNotes = (values: CoachNotesFormValues) => {
    setCoachNotes(values)
    generatePdfWithToast(values)
  }

  const generatePdfWithToast = async (notes?: CoachNotesFormValues) => {
    toast({
      title: 'Generating PDF...',
      description: 'Please wait while we generate your PDF.',
    })

    try {
      // Convert the exportType to string if it's an enum
      const exportTypeValue =
        typeof options.exportType === 'string' ? options.exportType : options.exportType

      const exportOptions: PdfExportOptions = {
        ...options,
        exportType: exportTypeValue as PdfTypeEnum,
        notes: notes,
      }

      const success = await generatePdf(exportOptions)

      if (success) {
        toast({
          title: 'PDF Generated',
          description: 'Your PDF has been successfully generated and downloaded.',
          variant: 'default',
        })
      } else {
        throw new Error('PDF generation failed')
      }
    } catch (error) {
      toast({
        title: 'PDF Generation Failed',
        description: 'There was an error generating your PDF. Please try again.',
        variant: 'destructive',
      })
      console.error('PDF generation error:', error)
    }
  }

  return (
    <>
      <Button
        onClick={handleExport}
        variant={variant}
        size={size}
        className={className}
        style={style}
        disabled={disabled}
      >
        <Download className='mr-1 size-4' />
        {customLabel || 'Export PDF'}
      </Button>
      <PdfCoachNotesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirmCoachNotes}
        defaultValues={coachNotes}
      />
    </>
  )
}
