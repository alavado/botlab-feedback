import './AlertsFilters.css'
import ServicesFilter from './ServicesFilter'

const AlertsFilters = () => {
  return (
    <div className="AlertsFilters">
      <ServicesFilter />
      <div>Sucursales</div>
      <div>Tipos de alertas</div>
    </div>
  )
}

export default AlertsFilters
