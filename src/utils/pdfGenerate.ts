import mustache from 'mustache'

export interface ChartData {
  offensiveChartData: never;
  defensiveChartData: never;
  possessionChartData: never;
  disciplinaryChartData: never;
  goalkeeperChartData: never;
}

async function loadPdfTemplate<K>(templateName: string,
  data: K): Promise<string> {
  const response = await fetch(`/pdfTemplates/${templateName}.html`)
  if (response.status !== 200) {
    throw new Error(`Failed to load PDF template: ${response.statusText}`)
  }
  const template = await response.text()
  return renderTemplate(template, data)
}

function renderTemplate<K>(template: string, data: K): string {
  return mustache.render(template, data)
}

export async function renderHTML<K>(
  templateName: string,
  data: K,
){
  return await loadPdfTemplate(
    templateName,
    {
      ...data,
    },
  )
}
