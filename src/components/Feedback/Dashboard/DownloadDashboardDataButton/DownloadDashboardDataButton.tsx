import { Icon } from '@iconify/react'
import { downloadDashboardScreenshot, downloadDashboardData } from '../utils'
import './DownloadDashboardDataButton.css'
import useMetricsQuery from '../../../../api/hooks/useMetricsQuery'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import Loader from '../../../Loader'
import useAnalytics from '../../../../hooks/useAnalytics'

const DownloadDashboardDataButton = () => {
  const { data, isLoading } = useMetricsQuery()
  const { start, end } = useSelector((state: RootState) => state.dashboard)
  const track = useAnalytics()

  if (!data) {
    return <Loader />
  }

  return (
    <div className="DownloadDashboardDataButton">
      <button
        className="DownloadDashboardDataButton__main_button"
        onClick={() => {
          track('Feedback', 'Dashboard', 'downloadDashboardData')
          downloadDashboardData({ startDate: start, endDate: end, data })
        }}
        title="Descargar datos en formato Excel"
        disabled={isLoading || !data}
      >
        <Icon icon="mdi:download-box" />
        Descargar
      </button>

      <button
        className="DownloadDashboardDataButton__secondary_button"
        onClick={() => {
          track('Feedback', 'Dashboard', 'downloadDashboardScreenshot')
          downloadDashboardScreenshot()
        }}
        title="Descargar captura del dashboard"
        disabled={isLoading || !data}
      >
        <Icon icon="mdi:camera" />
      </button>
    </div>
  )
}

export default DownloadDashboardDataButton
