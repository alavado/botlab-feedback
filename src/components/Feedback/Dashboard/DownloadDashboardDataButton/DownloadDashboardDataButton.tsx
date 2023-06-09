import { Icon } from '@iconify/react'
import { downloadDashboardData } from '../utils'
import './DownloadDashboardDataButton.css'
import useMetricsQuery from '../../../../api/hooks/useMetricsQuery'

const DownloadDashboardDataButton = ({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}) => {
  const { data } = useMetricsQuery({ startDate, endDate })

  if (!data) {
    return null
  }

  return (
    <button
      className="DownloadDashboardDataButton"
      onClick={() => downloadDashboardData({ startDate, endDate, data })}
    >
      <Icon icon="mdi:download" />
      Descargar
    </button>
  )
}

export default DownloadDashboardDataButton
