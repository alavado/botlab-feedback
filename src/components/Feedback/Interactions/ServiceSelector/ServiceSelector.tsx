import classNames from 'classnames'
import './ServiceSelector.css'
import { useHistory } from 'react-router-dom'
import Loader from '../../../Loader/Loader'
import useServicesQuery from '../../../../api/hooks/useServicesQuery'
import useActiveServiceQuery from '../../../../api/hooks/useActiveServiceQuery'
import { useEffect } from 'react'
import { Icon } from '@iconify/react'

const ServiceSelector = () => {
  const { data: services, isLoading: loadingServices } = useServicesQuery()
  const { data: activeService, isLoading: loadingActiveService } =
    useActiveServiceQuery()
  const history = useHistory()

  useEffect(() => {
    if (
      !loadingActiveService &&
      !activeService &&
      services &&
      services.length > 0
    ) {
      const firstService = services[0]
      history.push(`/interacciones/${firstService.id}`)
    }
  }, [loadingActiveService, services, activeService, history])

  return (
    <div className="ServiceSelector">
      {loadingServices ? (
        <Loader />
      ) : (
        services?.map((service) => (
          <button
            key={`tab-service-${service.id}`}
            className={classNames({
              ServiceSelector__tab: true,
              'ServiceSelector__tab--active': activeService?.id === service.id,
            })}
            onClick={() => history.push(`/interacciones/${service.id}`)}
          >
            <Icon
              className="ServiceSelector__tab_button_icon"
              icon="mdi:whatsapp"
            />
            <p className="ServiceSelector__tab_label">{service.name}</p>
          </button>
        ))
      )}
    </div>
  )
}

export default ServiceSelector
