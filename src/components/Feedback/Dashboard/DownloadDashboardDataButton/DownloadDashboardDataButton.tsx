import { Icon } from '@iconify/react'
import { downloadDashboardData } from '../utils'
import './DownloadDashboardDataButton.css'
import useMetricsQuery from '../../../../api/hooks/useMetricsQuery'
import { RootState } from '../../../../redux/ducks'
import { useSelector } from 'react-redux'
import { toBlob } from 'html-to-image'

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
      onClick={async () => {
        if (!data) {
          return
        }
        const nodoContenedor = document.getElementsByClassName(
          'Feedback__contenedor_central'
        )[0] as HTMLElement
        const blob = await toBlob(nodoContenedor, {
          width: nodoContenedor.scrollWidth,
          height: nodoContenedor.scrollHeight,
        })
      }}
      title="Descargar datos en formato Excel"
      disabled={isLoading || !data}
    >
      <Icon icon="mdi:download" />
      Descargar
    </button>
  )
}

export default DownloadDashboardDataButton
