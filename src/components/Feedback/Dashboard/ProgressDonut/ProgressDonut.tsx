import { CSSProperties } from 'react'
import useMetricsProgressQuery, {
  ProgressMetric,
} from '../../../../api/hooks/useMetricsProgressQuery'
import Loader from '../../../Loader/Loader'
import './ProgressDonut.css'
import { getMetricHexColor } from '../utils'

const ProgressDonut = ({
  startDate,
  endDate,
  metric,
}: {
  startDate: Date
  endDate: Date
  metric: ProgressMetric
}) => {
  const { data, isLoading } = useMetricsProgressQuery({
    startDate,
    endDate,
    metric,
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <div
      className="ProgressDonut"
      style={
        {
          '--donut-leftover': `${data?.fillPercentage}%`,
          '--donut-material': getMetricHexColor(metric),
        } as CSSProperties
      }
    >
      <h2 className="ProgressDonut__title">{data?.title}</h2>
      <figure className="ProgressDonut__figure">{data?.count}</figure>
      <p className="ProgressDonut__label">{data?.label}</p>
    </div>
  )
}

export default ProgressDonut
