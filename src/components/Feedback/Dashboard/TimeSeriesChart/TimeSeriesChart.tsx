import { Line } from 'react-chartjs-2'
import './TimeSeriesChart.css'
import { DailyMetrics } from '../../../../api/hooks/useMetricsQuery'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Loader from '../../../Loader/Loader'
import useDashboardTimeSeriesQuery from '../../../../api/hooks/useMetricsTimeSeriesQuery'
import { getDataGroupingXLabel, getMetricHexColor } from '../utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'

const TimeSeriesChart = () => {
  const { groupBy } = useSelector((state: RootState) => state.dashboard)
  const { data, isLoading, isError, error } = useDashboardTimeSeriesQuery()

  if (isLoading || !data) {
    return <Loader />
  }

  if (isError) {
    return <p>{error.toString()}</p>
  }

  const maxValue = Math.max(...data.map((d: DailyMetrics) => d.total))
  const order = Math.pow(10, Math.floor(Math.log10(maxValue)))
  const maxTick = order * Math.ceil(maxValue / order)
  const tickCount = 10
  const stepSize = maxTick / tickCount

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
              stepSize,
              callback: (val) => val.toLocaleString('de-DE'),
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
            label: 'Total de Citas',
            data: data.map((d: DailyMetrics) => d.total),
            borderColor: getMetricHexColor('TOTAL'),
            backgroundColor: getMetricHexColor('TOTAL'),
            pointHitRadius: 25,
            borderWidth: 4,
          },
          {
            label: 'Con respuesta',
            data: data.map((d: DailyMetrics) => d.answered),
            borderColor: getMetricHexColor('ANSWERED'),
            backgroundColor: getMetricHexColor('ANSWERED'),
            pointHitRadius: 25,
            borderWidth: 4,
          },
        ],
      }}
    />
  )
}

export default TimeSeriesChart