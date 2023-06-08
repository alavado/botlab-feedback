import classNames from 'classnames'
import { useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import MenuUsuario from '../BarraSuperior/MenuUsuario'
import InteractionDrawer from '../InteractionDrawer'
import './Alerts.css'
import AlertsList from './AlertsList'
import AlertsSidebar from './AlertsSidebar'
import ToggleSidebarButton from './ToggleSidebarButton'
import InteractionDrawerCover from '../InteractionDrawer/InteractionDrawerCover'

interface AlertsRouteParams {
  patientId?: string
  serviceId?: string
}

const Alerts = () => {
  const { params }: { params: AlertsRouteParams } = useRouteMatch()
  const history = useHistory()

  const patientId = params && Number(params?.patientId)
  const serviceId = params && Number(params?.serviceId)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  return (
    <div className="Alerts">
      <InteractionDrawerCover visible={!!patientId && !!serviceId} />
      <div
        className={classNames({
          Alerts__drawer: true,
          'Alerts__drawer--hidden': !patientId || !serviceId,
        })}
      >
        {patientId && serviceId && (
          <InteractionDrawer
            interactionId={{
              serviceId,
              patientId,
              start: new Date(),
            }}
            onCloseClick={() => history.push('/alertas')}
            originComponentName="Alerts"
          />
        )}
      </div>
      <div className="Alerts__topbar">
        <div className="Alerts__topbar_left">
          <h2 className="Alerts__title">Alertas</h2>
          <ToggleSidebarButton />
        </div>
        <MenuUsuario />
      </div>
      <div className="Alerts__container">
        <AlertsSidebar />
        <main className="Alerts__main">
          <AlertsList
            selectedPatientId={patientId}
            selectedServiceId={serviceId}
          />
        </main>
      </div>
    </div>
  )
}

export default Alerts
