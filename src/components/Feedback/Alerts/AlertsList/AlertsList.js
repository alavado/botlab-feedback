import { Icon } from '@iconify/react'
import classNames from 'classnames'
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
          className={classNames({
            AlertsList__tab_button: true,
            'AlertsList__tab_button--active': !showSolved,
          })}
          onClick={() => setShowSolved(false)}
        >
          <Icon className="AlertsList__tab_button_icon" icon="mdi:bell" />
          <p className="AlertsList__tab_label">Pendientes</p>
          <p className="AlertsList__tab_count">
            {pendingAlertsCount} alerta{pendingAlertsCount !== 1 ? 's' : ''}
          </p>
        </button>
        <button
          className={classNames({
            AlertsList__tab_button: true,
            'AlertsList__tab_button--active': showSolved,
          })}
          onClick={() => setShowSolved(true)}
        >
          <Icon className="AlertsList__tab_button_icon" icon="mdi:bell-check" />
          <p className="AlertsList__tab_label">Resueltas</p>
          <p className="AlertsList__tab_count">
            {solvedAlertsCount} alerta{solvedAlertsCount !== 1 ? 's' : ''}
          </p>
        </button>
      </div>
      <div className="AlertsList__container">
        {visibleAlerts.map((alert) => (
          <button
            className="AlertsList__alert"
            onClick={() =>
              history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
            }
            key={alert.id}
          >
            <Icon icon="mdi:bell" />
            {format(alert.timestamp, 'HH:mm dd/MM')}
            {alert.typeId}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AlertsList
