import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import {
  disableNotifications,
  enableNotifications,
} from '../../../../redux/ducks/alerts'
import './AlertsOptions.css'

const AlertsOptions = () => {
  const { notificationsEnabled } = useSelector(
    (state: RootState) => state.alerts
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (notificationsEnabled) {
      Notification.requestPermission()
    }
  }, [notificationsEnabled])

  return (
    <div className="AlertsOptions">
      <h3 className="AlertsOptions__title">
        <Icon icon="mdi:cog" />
        Opciones
      </h3>
      <label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={() =>
            notificationsEnabled
              ? dispatch(disableNotifications())
              : dispatch(enableNotifications())
          }
        />{' '}
        Notificaciones activadas
      </label>
    </div>
  )
}

export default AlertsOptions
