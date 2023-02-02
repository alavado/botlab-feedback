import { Icon } from '@iconify/react'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useActiveAlertsQuery from '../../../../api/hooks/useActiveAlertsQuery'
import Loader from '../../../Loader'
import './AlertsList.css'

const AlertsList = () => {
  const [showSolved, setShowSolved] = useState(false)
  const { data, isLoading } = useActiveAlertsQuery()
  const history = useHistory()

  const visibleAlerts = useMemo(() => {
    if (!data) {
      return []
    }
    return showSolved ? data.solved : data.pending
  }, [showSolved, data])

  if (isLoading) {
    return <Loader />
  }

  const solvedAlertsCount = data?.solved.length
  const pendingAlertsCount = data?.pending.length

  return (
    <div className="AlertsList">
      <div className="AlertsList__tabs">
        <button
          className="AlertsList__tab_button"
          onClick={() => setShowSolved(false)}
        >
          <Icon icon="mdi:bell" />
          <p>No resueltas</p>
          <p>
            {pendingAlertsCount} alerta{pendingAlertsCount !== 1 ? 's' : ''}
          </p>
        </button>
        <button
          className="AlertsList__tab_button"
          onClick={() => setShowSolved(true)}
        >
          <Icon icon="mdi:bell-check" />
          <p>Resueltas</p>
          <p>
            {solvedAlertsCount} alerta{solvedAlertsCount !== 1 ? 's' : ''}
          </p>
        </button>
      </div>
      {visibleAlerts.map((alert) => (
        <div
          className="AlertsList__alert"
          onClick={() =>
            history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
          }
        >
          <Icon icon="mdi:bell" />
          {format(alert.timestamp, 'HH:mm dd/MM')}
          {alert.typeId}
        </div>
      ))}
    </div>
  )
}

export default AlertsList
