import useServicesQuery from '../../../../../api/hooks/useServicesQuery'
import Loader from '../../../../Loader'
import './ServicesFilter.css'

const ServicesFilter = () => {
  const { data: services, isLoading } = useServicesQuery()

  if (isLoading) {
    return <Loader />
  }

  console.log(services)

  return (
    <div className="ServicesFilter">
      {services?.map((service) => (
        <div key={`ServicesFilter-${service.name}`}>{service.name}</div>
      ))}
    </div>
  )
}

export default ServicesFilter
