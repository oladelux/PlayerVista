import { Button } from '@/components/ui/button.tsx'
import {
  generatePDF,
} from '@/api'
import { downloadBlob } from '@/utils/downloadFile.ts'
import { PdfType } from '@/config/PdfType.ts'
import { renderHTML } from '@/utils/pdfGenerate.ts'

type DownloadPdfButtonProps<T> = {
  filename: string,
  pdfType: PdfType,
  templateName: string,
  data: T,
}

export default function DownloadPdfButton<T>(
  { filename, pdfType, templateName, data }: DownloadPdfButtonProps<T> ) {

  async function savePdf(){
    try {
      const html = await renderHTML(templateName, data)
      const res = await generatePDF({ html })
      const blob = await res.blob()
      downloadBlob(blob, `${filename}_${pdfType}.pdf`)
    } catch (error) {
      console.error('Error generating PDF', error)
    }
  }
  return (
    <Button
      type='button'
      className='bg-dark-purple text-white hover:bg-dark-purple'
      onClick={savePdf}
    >
      Export
    </Button>
  )
}
