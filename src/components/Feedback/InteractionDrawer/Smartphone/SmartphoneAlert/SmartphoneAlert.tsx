import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useCallback } from 'react'
import useChangeAlertMutation from '../../../../../api/hooks/useChangeAlertStatusMutation'
import { Alert, PatientId, ServiceId } from '../../../../../api/types/types'
import useAnalytics from '../../../../../hooks/useAnalytics'
import {
  getAlertButtonIcon,
  getAlertButtonLabel,
  getAlertButtonTitle,
} from '../../../Alerts/helpers'
import './SmartphoneAlert.css'

const SmartphoneAlert = ({ alert }: { alert: Alert }) => {
  const mutation = useChangeAlertMutation({
    alertId: alert.id,
    serviceId: alert.serviceId,
    patientId: alert.patientId,
    solved: !alert.solved,
  })
  const track = useAnalytics()

  const changeAlertSolvedStatus = useCallback(() => {
    mutation.mutate({})
    track(
      'Feedback',
      'Smartphone',
      alert.solved ? 'markAlertAsPending' : 'markAlertAsSolved',
      {
        alert,
      }
    )
  }, [alert, track, mutation])

  return (
    <div
      className={classNames({
        SmartphoneAlert: true,
        'SmartphoneAlert--solved': alert.solved,
        'SmartphoneAlert--pending': !alert.solved,
      })}
    >
      <Icon
        className="SmartphoneAlert__icon"
        icon={alert.solved ? 'mdi:bell-check' : 'mdi:bell-ring'}
      />
      <p className="SmartphoneAlert__message">{alert.typeName}</p>
      <p className="SmartphoneAlert__title">
        Alerta {alert.solved ? 'resuelta' : 'pendiente'}
      </p>
      <button
        className="SmartphoneAlert__button"
        onClick={changeAlertSolvedStatus}
        title={getAlertButtonTitle(alert.solved)}
      >
        <Icon icon={getAlertButtonIcon(alert.solved)} />{' '}
        {getAlertButtonLabel(alert.solved)}
      </button>
    </div>
  )
}

export default SmartphoneAlert
