import useServicesQuery from '../../../../api/hooks/useServicesQuery'
import './AlertsFilters.css'

const AlertsFilters = () => {
  const { data } = useServicesQuery()

  console.log(data)

  return (
    <div className="AlertsFilters">
      <div>Servicios</div>
      <div>Sucursales</div>
      <div>Tipos de alertas</div>
    </div>
  )
}

export default AlertsFilters
