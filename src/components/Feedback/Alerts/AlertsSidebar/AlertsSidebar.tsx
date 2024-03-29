import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import useAnalytics from '../../../../hooks/useAnalytics'
import { RootState } from '../../../../redux/ducks'
import { hideSettings } from '../../../../redux/ducks/alerts'
import AlertsFilters from './AlertsFilters'
import AlertsOptions from './AlertsOptions'
import './AlertsSidebar.css'

const AlertsSidebar = () => {
  const { settingsHidden } = useSelector((state: RootState) => state.alerts)
  const dispatch = useDispatch()
  const track = useAnalytics()

  return (
    <aside
      className={classNames({
        AlertsSidebar: true,
        'AlertsSidebar--hidden': settingsHidden,
      })}
    >
      <div className="AlertsSidebar__top">
        <span className="AlertsSidebar__title">
          <Icon className="AlertsSidebar__title_icon" icon="mdi:cog" />{' '}
          Configuración
        </span>
        <button
          className="AlertsSidebar__close_button"
          onClick={() => {
            track('Feedback', 'Alerts', 'hideAlertSettings')
            dispatch(hideSettings())
          }}
          title="Cerrar configuración"
        >
          <Icon icon="mdi:close" />
        </button>
      </div>
      <AlertsFilters />
      <AlertsOptions />
    </aside>
  )
}

export default AlertsSidebar
