import { Icon } from '@iconify/react'
import { downloadDashboardData } from '../utils'
import './DownloadDashboardDataButton.css'
import useMetricsQuery from '../../../../api/hooks/useMetricsQuery'
import { RootState } from '../../../../redux/ducks'
import { useSelector } from 'react-redux'

const DownloadDashboardDataButton = () => {
  const { startDate, endDate } = useSelector(
    (state: RootState) => state.dashboard
  )
  const { data } = useMetricsQuery({ startDate, endDate })

  if (!data) {
    return null
  }

  return (
    <button
      className="DownloadDashboardDataButton"
      onClick={() => downloadDashboardData({ startDate, endDate, data })}
      title="Descargar datos en formato Excel"
    >
      <Icon icon="mdi:download" />
      Descargar
    </button>
  )
}

export default DownloadDashboardDataButton
