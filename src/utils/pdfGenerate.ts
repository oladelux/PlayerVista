import mustache from 'mustache'

interface ChartData {
  offensiveChartData: never;
  defensiveChartData: never;
  possessionChartData: never;
  disciplinaryChartData: never;
  goalkeeperChartData: never;
}

async function loadPdfTemplate<K extends ChartData>(templateName: string,
  data: K): Promise<string> {
  const response = await fetch(`/pdfTemplates/${templateName}.html`)
  if (response.status !== 200) {
    throw new Error(`Failed to load PDF template: ${response.statusText}`)
  }
  const template = await response.text()
  return renderTemplate(template, data)
}

function renderTemplate<K extends ChartData>(template: string, data: K): string {
  return mustache.render(template, data)
}

export async function renderHTML<K extends ChartData>(
  templateName: string,
  data: K,
){
  return await loadPdfTemplate(
    templateName,
    {
      ...data,
      offensiveChartData: JSON.stringify(data.offensiveChartData),
      defensiveChartData: JSON.stringify(data.defensiveChartData),
      possessionChartData: JSON.stringify(data.possessionChartData),
      disciplinaryChartData: JSON.stringify(data.disciplinaryChartData),
      goalkeeperChartData: JSON.stringify(data.goalkeeperChartData),
    },
  )
}
