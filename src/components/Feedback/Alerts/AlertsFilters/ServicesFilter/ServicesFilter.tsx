import useServicesQuery from '../../../../../api/hooks/useServicesQuery'
import Loader from '../../../../Loader'
import './ServicesFilter.css'

const ServicesFilter = () => {
  const { data: services, isLoading } = useServicesQuery()

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="ServicesFilter">
      <h3>Servicios</h3>
      {services?.map((service) => (
        <div key={`ServicesFilter-${service.name}`}>{service.name}</div>
      ))}
    </div>
  )
}

export default ServicesFilter
