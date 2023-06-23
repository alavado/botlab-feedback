import { Icon } from '@iconify/react'
import { downloadDashboardScreenshot } from '../utils'
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
      onClick={downloadDashboardScreenshot}
      title="Descargar captura del dashboard"
      disabled={isLoading || !data}
    >
      <Icon icon="mdi:download-box" />
      Descargar
    </button>
  )
}

export default DownloadDashboardDataButton
