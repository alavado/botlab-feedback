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

  return (
    <div className="AlertsOptions">
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
