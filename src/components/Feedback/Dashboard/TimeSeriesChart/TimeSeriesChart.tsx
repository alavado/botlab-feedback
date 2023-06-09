import { Line } from 'react-chartjs-2'
import './TimeSeriesChart.css'
import { DailyMetrics } from '../../../../api/hooks/useMetricsQuery'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Loader from '../../../Loader/Loader'
import useDashboardTimeSeriesQuery, {
  MetricsTimeSeriesGroupByUnit,
} from '../../../../api/hooks/useMetricsTimeSeriesQuery'
import { getDataGroupingXLabel, getMetricHexColor } from '../utils'

const TimeSeriesChart = ({
  startDate,
  endDate,
  groupBy,
  skipNoContactDays,
}: {
  startDate: Date
  endDate: Date
  groupBy: MetricsTimeSeriesGroupByUnit
  skipNoContactDays: boolean
}) => {
  const { data, isLoading, isError, error } = useDashboardTimeSeriesQuery({
    startDate,
    endDate,
    groupBy,
    skipNoContactDays,
  })

  if (isLoading || !data) {
    return <Loader />
  }

  if (isError) {
    return <p>{error.toString()}</p>
  }

  return (
    <Line
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: getDataGroupingXLabel(groupBy),
            },
            grid: {
              display: false,
            },
          },
          y: {
            min: 0,
            title: {
              display: true,
              text: 'Citas',
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
      }}
      data={{
        labels: data.map((d: DailyMetrics) => {
          switch (groupBy) {
            case 'WEEK':
              return 'Semana del ' + format(d.date, 'dd/MM')
            case 'MONTH':
              return format(d.date, 'MMMM', { locale: es })
            default:
              return format(d.date, 'dd/MM')
          }
        }),
        datasets: [
          {
            label: 'Citas',
            data: data.map((d: DailyMetrics) => d.total),
            borderColor: getMetricHexColor('TOTAL'),
            backgroundColor: getMetricHexColor('TOTAL'),
          },
          {
            label: 'Respondidas',
            data: data.map((d: DailyMetrics) => d.answered),
            borderColor: getMetricHexColor('ANSWERED'),
            backgroundColor: getMetricHexColor('ANSWERED'),
          },
        ],
      }}
    />
  )
}

export default TimeSeriesChart
