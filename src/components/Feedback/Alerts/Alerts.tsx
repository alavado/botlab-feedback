import classNames from 'classnames'
import { useHistory, useRouteMatch } from 'react-router-dom'
import MenuUsuario from '../BarraSuperior/MenuUsuario'
import InteractionDrawer from '../Search/InteractionDrawer'
import './Alerts.css'
import AlertsFilters from './AlertsFilters'
import AlertsList from './AlertsList'
import AlertsOptions from './AlertsOptions'

interface AlertsRouteParams {
  patientId?: string
  serviceId?: string
}

const Alerts = () => {
  const { params }: { params: AlertsRouteParams } = useRouteMatch()
  const history = useHistory()

  const patientId = params?.patientId
  const serviceId = params?.serviceId

  return (
    <div className="Alerts">
      <div className="Alerts__topbar" onClick={() => history.push('/alertas')}>
        <h2 className="Alerts__title">Alertas</h2>
        <MenuUsuario />
      </div>
      <div className="Alerts__container">
        <aside className="Alerts__aside">
          <AlertsFilters />
          {/* <AlertsOptions /> */}
        </aside>
        <main className="Alerts__main">
          <AlertsList />
        </main>
      </div>
      <div
        className={classNames({
          Alerts__drawer: true,
          'Alerts__drawer--hidden': !patientId || !serviceId,
        })}
      >
        {patientId && serviceId && (
          <InteractionDrawer
            serviceId={Number(serviceId)}
            patientId={Number(patientId)}
            onCloseClick={() => history.push('/alertas')}
            originComponentName="Alerts"
            start={new Date()}
          />
        )}
      </div>
    </div>
  )
}

export default Alerts
