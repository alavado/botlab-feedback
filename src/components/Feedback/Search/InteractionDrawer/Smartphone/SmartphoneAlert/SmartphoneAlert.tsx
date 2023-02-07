import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useCallback } from 'react'
import useChangeAlertMutation from '../../../../../../api/hooks/useChangeAlertStatusMutation'
import useAnalytics from '../../../../../../hooks/useAnalytics'
import {
  getAlertButtonIcon,
  getAlertButtonLabel,
  getAlertButtonTitle,
} from '../../../../Alerts/helpers'
import './SmartphoneAlert.css'

const SmartphoneAlert = ({
  label,
  alertId,
  solved,
}: {
  label: string
  alertId: number
  solved: boolean
}) => {
  const mutation = useChangeAlertMutation({ alertId, solved: !solved })
  const track = useAnalytics()

  const changeAlertSolvedStatus = useCallback(() => {
    mutation.mutate({})
    track(
      'Feedback',
      'Smartphone',
      solved ? 'markAlertAsPending' : 'markAlertAsSolved',
      {
        alert,
      }
    )
  }, [solved, track, mutation])

  return (
    <div
      className={classNames({
        SmartphoneAlert: true,
        'SmartphoneAlert--solved': solved,
        'SmartphoneAlert--pending': !solved,
      })}
    >
      <Icon
        className="SmartphoneAlert__icon"
        icon={solved ? 'mdi:bell-check' : 'mdi:bell-ring'}
      />
      <p className="SmartphoneAlert__message">{label}</p>
      <p className="SmartphoneAlert__title">
        Alerta {solved ? 'resuelta' : 'pendiente'}
      </p>
      <button
        className="SmartphoneAlert__button"
        onClick={changeAlertSolvedStatus}
        title={getAlertButtonTitle(solved)}
      >
        <Icon icon={getAlertButtonIcon(solved)} /> {getAlertButtonLabel(solved)}
      </button>
    </div>
  )
}

export default SmartphoneAlert
