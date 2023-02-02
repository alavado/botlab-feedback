import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { Alert } from '../../../../../api/types/servicio'
import './AlertElement.css'

const AlertElement = ({
  alert,
  highlighted,
}: {
  alert: Alert
  highlighted: boolean
}) => {
  const history = useHistory()

  return (
    <button
      className={classNames({
        AlertElement: true,
        'AlertElement--pending': !alert.solved,
        'AlertElement--solved': alert.solved,
        'AlertElement--selected': highlighted,
      })}
      onClick={() =>
        history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
      }
      key={alert.id}
    >
      <Icon
        className="AlertElement_icon"
        icon={alert.solved ? 'mdi:bell-check' : 'mdi:bell-ring'}
      />
      <span className="AlertElement__time">{alert.formattedTimestamp}</span>
      <span className="AlertElement__name">{alert.typeName}</span>
      <span className="AlertElement__data">
        {alert.patientName} • {alert.serviceName} • {alert.branchName}
      </span>
      {highlighted && (
        <button
          className="AlertElement__solve_alert_button"
          style={{
            right: document
              .querySelector('.InteractionDrawer')
              ?.getBoundingClientRect().width,
          }}
        >
          <Icon icon={alert.solved ? 'mdi:undo' : 'mdi:check'} /> Marcar{' '}
          {alert.solved ? 'pendiente' : 'resuelta'}
        </button>
      )}
    </button>
  )
}

export default AlertElement
