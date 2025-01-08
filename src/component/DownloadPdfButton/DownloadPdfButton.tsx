import {
  generatePDF,
} from '@/api'
import { downloadBlob } from '@/utils/downloadFile.ts'
import { PdfType } from '@/config/PdfType.ts'
import { renderHTML } from '@/utils/pdfGenerate.ts'
import { useState } from 'react'
import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'
import { useToast } from '@/hooks/use-toast.ts'

type DownloadPdfButtonProps<T> = {
  filename: string,
  pdfType: PdfType,
  templateName: string,
  data: T,
}

export default function DownloadPdfButton<T>(
  { filename, pdfType, templateName, data }: DownloadPdfButtonProps<T> ) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function savePdf(){
    setLoading(true)
    try {
      const html = await renderHTML(templateName, data)
      const res = await generatePDF({ html })
      const blob = await res.blob()
      downloadBlob(blob, `${filename}_${pdfType}.pdf`)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast({
        variant: 'error',
        description: 'Error generating PDF',
      })
      console.error('Error generating PDF', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      isLoading={loading}
      type='button'
      className='bg-dark-purple text-white hover:bg-dark-purple'
      onClick={savePdf}
    >
      Export
    </LoadingButton>
  )
}
