import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import useActiveAlertsQuery from '../../../../api/hooks/useActiveAlertsQuery'
import { Alert, PatientId, ServiceId } from '../../../../api/types/domain'
import Loader from '../../../Loader'
import AlertElement from './AlertElement'
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
        {visibleAlerts.map((alert: Alert, i) => (
          <AlertElement
            highlighted={
              selectedPatientId === alert.patientId &&
              selectedServiceId === alert.serviceId
            }
            alert={alert}
            key={`alert-element-${i}`}
          />
        ))}
      </div>
    </div>
  )
}

export default AlertsList
