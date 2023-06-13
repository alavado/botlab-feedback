import { Icon } from '@iconify/react'
import { downloadDashboardData } from '../utils'
import './DownloadDashboardDataButton.css'
import useMetricsQuery from '../../../../api/hooks/useMetricsQuery'
import { RootState } from '../../../../redux/ducks'
import { useSelector } from 'react-redux'

const DownloadDashboardDataButton = () => {
  const { start: startDate, end: endDate } = useSelector(
    (state: RootState) => state.dashboard
  )
  const { data, isLoading } = useMetricsQuery({
    start: startDate,
    end: endDate,
  })

  return (
    <button
      className="DownloadDashboardDataButton"
      onClick={() =>
        data && downloadDashboardData({ startDate, endDate, data })
      }
      title="Descargar datos en formato Excel"
      disabled={isLoading || !data}
    >
      <Icon icon="mdi:download" />
      Descargar
    </button>
  )
}

export default DownloadDashboardDataButton
