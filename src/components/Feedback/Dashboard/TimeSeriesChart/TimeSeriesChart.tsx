import { Line } from 'react-chartjs-2'
import './TimeSeriesChart.css'
import { DailyMetrics } from '../../../../api/hooks/useMetricsQuery'
import { endOfWeek, format } from 'date-fns'
import { es } from 'date-fns/locale'
import Loader from '../../../Loader/Loader'
import useDashboardTimeSeriesQuery from '../../../../api/hooks/useMetricsTimeSeriesQuery'
import { getDataGroupingXLabel, getMetricHexColor } from '../utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import { useIsFetching } from 'react-query'

const TimeSeriesChart = () => {
  const { timeUnit } = useSelector((state: RootState) => state.dashboard)
  const { data, isLoading, isError, error } = useDashboardTimeSeriesQuery()
  const isFetchingMetrics = useIsFetching({ queryKey: ['metrics'] })

  if (isLoading || isFetchingMetrics || !data) {
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
              text: getDataGroupingXLabel(timeUnit),
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
          switch (timeUnit) {
            case 'WEEK':
              return `Semana ${format(d.date, 'II')}: ${format(
                d.date,
                'd/M'
              )} al ${format(endOfWeek(d.date, { weekStartsOn: 1 }), 'd/M')}`
            case 'MONTH':
              return format(d.date, 'MMMM', { locale: es })
            default:
              return format(d.date, 'eee dd/MM', { locale: es })
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
            tension: 0.2,
          },
          {
            label: 'Con respuesta',
            data: data.map((d: DailyMetrics) => d.answered),
            borderColor: getMetricHexColor('ANSWERED'),
            backgroundColor: getMetricHexColor('ANSWERED'),
            pointHitRadius: 25,
            borderWidth: 4,
            tension: 0.2,
          },
          {
            label: 'Confirmadas',
            data: data.map((d: DailyMetrics) => d.confirmed),
            borderColor: getMetricHexColor('CONFIRMED'),
            backgroundColor: getMetricHexColor('CONFIRMED'),
            pointHitRadius: 25,
            borderWidth: 4,
            tension: 0.2,
          },
          {
            label: 'Anuladas',
            data: data.map((d: DailyMetrics) => d.cancelled),
            borderColor: getMetricHexColor('CANCELLED'),
            backgroundColor: getMetricHexColor('CANCELLED'),
            pointHitRadius: 25,
            borderWidth: 4,
            tension: 0.2,
          },
        ],
      }}
    />
  )
}

export default TimeSeriesChart
