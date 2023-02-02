import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { format } from 'date-fns'
import useChangeAlertMutation from '../../../../../../api/hooks/useChangeAlertStatusMutation'
import './SmartphoneAlert.css'

const SmartphoneAlert = ({
  label,
  alertId,
  alertTimestamp,
  solved,
}: {
  label: string
  alertId: number
  alertTimestamp: Date
  solved: boolean
}) => {
  const mutation = useChangeAlertMutation({ alertId, solved: !solved })

  return (
    <div
      className={classNames({
        SmartphoneAlert: true,
        'SmartphoneAlert--solved': solved,
        'SmartphoneAlert--pending': !solved,
      })}
    >
      <p className="SmartphoneAlert__title">
        <Icon icon={solved ? 'mdi:bell-check' : 'mdi:bell-ring'} /> Alerta{' '}
        {solved ? 'resuelta' : 'pendiente'}
      </p>
      <p className="SmartphoneAlert__message">{label}</p>
      <button
        className="SmartphoneAlert__button"
        onClick={() => mutation.mutate({})}
      >
        {solved
          ? 'Marcar alerta como pendiente'
          : 'Marcar alerta como resuelta'}
      </button>
      <div className="SmartphoneAlert__bottom">
        <span></span>
        <span className="SmartphoneAlert__time">
          {format(alertTimestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  )
}

export default SmartphoneAlert
