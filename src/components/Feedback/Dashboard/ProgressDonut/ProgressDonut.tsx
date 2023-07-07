import { CSSProperties } from 'react'
import useMetricsProgressQuery, {
  ProgressMetric,
} from '../../../../api/hooks/useMetricsProgressQuery'
import Loader from '../../../Loader/Loader'
import './ProgressDonut.css'
import { getMetricHexColor } from '../utils'
import { useIsFetching } from 'react-query'

const ProgressDonut = ({ metric }: { metric: ProgressMetric }) => {
  const { data, isLoading } = useMetricsProgressQuery({ metric })
  const isFetchingMetrics = useIsFetching({ queryKey: ['metrics'] })

  if (isLoading || isFetchingMetrics) {
    return <Loader />
  }

  return (
    <div
      className="ProgressDonut"
      style={
        {
          '--donut-leftover': `${data?.fillPercentage ? (data.fillPercentage + .5) : 0}`,
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
