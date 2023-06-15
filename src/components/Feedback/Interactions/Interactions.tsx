import useServicesQuery from '../../../api/hooks/useServicesQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario/MenuUsuario'
import './Interactions.css'
import useInteractionsQuery from '../../../api/hooks/useInteractionsQuery'
import InteractionsLegacyTable from './InteractionsLegacyTable/InteractionsLegacyTable'
import Loader from '../../Loader/Loader'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import MiniDashboard from './MiniDashboard'
import InteractionDrawerCover from '../InteractionDrawer/InteractionDrawerCover/InteractionDrawerCover'
import { useHistory, useRouteMatch } from 'react-router-dom'
import useActiveServiceQuery from '../../../api/hooks/useActiveServiceQuery'

const Interactions = () => {
  const { data: services, isLoading: loadingServices } = useServicesQuery()
  const { data: interactions, isLoading: loadingInteractions } =
    useInteractionsQuery()
  const { params }: any = useRouteMatch()
  const { data: activeService } = useActiveServiceQuery()
  const history = useHistory()

  return (
    <div className="Interactions">
      <InteractionDrawerCover visible={params?.patientId} />
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
                onClick={() => history.push(`/interacciones/${service.id}`)}
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
