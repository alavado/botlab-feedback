import { format, formatISO } from 'date-fns'
import { DailyMetrics } from '../../../api/hooks/useMetricsQuery'
import { MetricsTimeSeriesTimeUnit } from '../../../api/hooks/useMetricsTimeSeriesQuery'
import { utils, writeFile } from 'xlsx-js-style'
import { ProgressMetric } from '../../../api/hooks/useMetricsProgressQuery'
import { toBlob } from 'html-to-image'

export const getDataGroupingXLabel = (
  groupBy: MetricsTimeSeriesTimeUnit
): string => {
  switch (groupBy) {
    case 'DAY':
      return 'Día'
    case 'WEEK':
      return 'Semana'
    case 'MONTH':
      return 'Mes'
    default:
      return 'Tiempo'
  }
}

export const getMetricHexColor = (metric: ProgressMetric): string => {
  switch (metric) {
    case 'TOTAL':
      return '#6057f6'
    case 'ANSWERED':
      return '#6af657'
    case 'CONFIRMED':
      return '#57f6dc'
    case 'CANCELLED':
      return '#f6a457'
    default:
      return '#ff00ff'
  }
}

export const downloadDashboardData = ({
  startDate,
  endDate,
  data,
}: {
  startDate: Date
  endDate: Date
  data: DailyMetrics[]
}) => {
  const startDateFormatted = format(startDate, 'dd-MM-yyyy')
  const endDateFormatted = format(endDate, 'dd-MM-yyyy')
  const xlsxFileName = `Feedback_Dashboard_${startDateFormatted}_${endDateFormatted}.xlsx`
  let xlsxHeaders = ['Fecha', 'Total', 'Respondidas']
  let xlsxRows = data.map((r) => [
    format(r.date, 'dd-MM-yyyy'),
    r.total,
    r.answered,
  ])
  const xlsxData = [xlsxHeaders, ...xlsxRows]
  const workbook = utils.book_new()
  const worksheet = utils.aoa_to_sheet(xlsxData)
  xlsxHeaders.forEach((_, i) => {
    const cell = worksheet[utils.encode_cell({ r: 0, c: i })]
    cell.s = { font: { bold: true } }
  })
  utils.book_append_sheet(workbook, worksheet, 'Dashboard')
  writeFile(workbook, xlsxFileName)
}

export const downloadDashboardScreenshot = async () => {
  const mainContainer = document.getElementsByClassName(
    'Feedback__contenedor_central'
  )[0] as HTMLElement
  const blob = await toBlob(mainContainer, {
    width: mainContainer.scrollWidth,
    height: mainContainer.scrollHeight,
  })
  const a = document.createElement('a')
  document.body.appendChild(a)
  const fileName = `Feedback-Dashboard-${formatISO(new Date())}.png`
  const url = window.URL.createObjectURL(blob as Blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}
