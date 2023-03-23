import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'
import { toggleNotifications } from '../../../../../redux/ducks/alerts'
import FilterCheckbox from '../AlertsFilters/FilterCheckbox'
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
      <FilterCheckbox
        checked={notificationsEnabled}
        onClick={() => dispatch(toggleNotifications())}
        label="Recibir notificaciones"
      />
    </div>
  )
}

export default AlertsOptions
