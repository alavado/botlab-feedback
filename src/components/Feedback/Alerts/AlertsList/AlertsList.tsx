import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import useActiveAlertsQuery from '../../../../api/hooks/useActiveAlertsQuery'
import { Alert, PatientId, ServiceId } from '../../../../api/types/servicio'
import Loader from '../../../Loader'
import './AlertsList.css'

const AlertsList = ({
  selectedPatientId,
  selectedServiceId,
}: {
  selectedPatientId?: PatientId
  selectedServiceId?: ServiceId
}) => {
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
            'AlertsList__tab_button--pending': true,
          })}
          onClick={() => setShowSolved(false)}
        >
          <Icon className="AlertsList__tab_button_icon" icon="mdi:bell-ring" />
          <p className="AlertsList__tab_label">Pendientes</p>
          <p className="AlertsList__tab_count">
            {pendingAlertsCount} alerta{pendingAlertsCount !== 1 ? 's' : ''}
          </p>
        </button>
        <button
          className={classNames({
            AlertsList__tab_button: true,
            'AlertsList__tab_button--active': showSolved,
            'AlertsList__tab_button--solved': true,
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
        {visibleAlerts.map((alert: Alert) => (
          <button
            className={classNames({
              AlertsList__alert: true,
              'AlertsList__alert--pending': !alert.solved,
              'AlertsList__alert--solved': alert.solved,
              'AlertsList__alert--selected':
                selectedPatientId === alert.patientId &&
                selectedServiceId === alert.serviceId,
            })}
            onClick={() =>
              history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
            }
            key={alert.id}
          >
            <Icon
              className="AlertsList__alert_icon"
              icon={alert.solved ? 'mdi:bell-check' : 'mdi:bell-ring'}
            />
            <span className="AlertList__alert_time">
              {alert.formattedTimestamp}
            </span>
            <span className="AlertList__alert_name">{alert.typeName}</span>
            <span className="AlertList__alert_data">
              {alert.patientName} • {alert.serviceName} • {alert.branchName}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AlertsList
