import { Icon } from '@iconify/react'
import { downloadDashboardScreenshot } from '../utils'
import './DownloadDashboardDataButton.css'
import useMetricsQuery from '../../../../api/hooks/useMetricsQuery'

const DownloadDashboardDataButton = () => {
  const { data, isLoading } = useMetricsQuery()

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
