import { useDispatch } from 'react-redux'
import useServicesQuery from '../../../api/hooks/useServicesQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario/MenuUsuario'
import './Interactions.css'
import useInteractionsQuery from '../../../api/hooks/useInteractionsQuery'
import InteractionsLegacyTable from './InteractionsLegacyTable/InteractionsLegacyTable'
import { selectService } from '../../../redux/ducks/answers'
import useActiveServiceQuery from '../../../api/hooks/useActiveServiceQuery'
import Loader from '../../Loader/Loader'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import MiniDashboard from './MiniDashboard'

const Interactions = () => {
  const { data: services, isLoading: loadingServices } = useServicesQuery()
  const { data: activeService } = useActiveServiceQuery()
  const { data: interactions, isLoading: loadingInteractions } =
    useInteractionsQuery({
      serviceId: activeService?.id,
      startDate: new Date(),
      endDate: new Date(),
    })
  const dispatch = useDispatch()

  return (
    <div className="Interactions">
      <div className="Interactions__topbar">
        <div className="Interactions__topbar_left">
          <h2 className="Interactions__title">Interacciones</h2>
        </div>
        <MenuUsuario />
      </div>
      <main className="Interactions__main">
        <div className="Interactions__services_tabs">
          {loadingServices ? (
            <Loader />
          ) : (
            services?.map((service) => (
              <button
                key={`tab-service-${service.id}`}
                onClick={() => dispatch(selectService(service.id))}
                className={classNames({
                  Interactions__service_tab: true,
                  'Interactions__service_tab--active':
                    activeService?.id === service.id,
                })}
              >
                <Icon
                  className="Interactions__tab_button_icon"
                  icon="mdi:whatsapp"
                />
                <p className="Interactions__tab_label">{service.name}</p>
              </button>
            ))
          )}
        </div>
        <div className="Interactions__sidebar">
          <MiniDashboard />
        </div>
        <div className="Interactions__table_container">
          {loadingInteractions && <Loader />}
          {interactions && activeService && (
            <InteractionsLegacyTable interactions={interactions} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Interactions
