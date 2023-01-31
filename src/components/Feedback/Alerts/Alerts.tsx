import useAlertsQuery from '../../../api/hooks/useAlertsQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario'
import './Alerts.css'
import AlertsFilters from './AlertsFilters'
import AlertsList from './AlertsList'
import AlertsOptions from './AlertsOptions'

const Alerts = () => {
  const { data } = useAlertsQuery()

  console.log(data)

  return (
    <div className="Alerts">
      <div className="Alerts__topbar">
        <h2 className="Alerts__title">Alertas</h2>
        <MenuUsuario />
      </div>
      <div>
        <div>
          <AlertsFilters />
          <AlertsOptions />
        </div>
        <div>
          <div> tabs rutas</div>
          <AlertsList />
        </div>
        <div>Cajon con ruta</div>
      </div>
    </div>
  )
}

export default Alerts
