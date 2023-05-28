import { useDispatch } from 'react-redux'
import useServicesQuery from '../../../api/hooks/useServicesQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario/MenuUsuario'
import './Answers.css'
import useInteractionsQuery from '../../../api/hooks/useInteractionsQuery'
import InteractionsLegacyTable from './InteractionsLegacyTable/InteractionsLegacyTable'
import { selectService } from '../../../redux/ducks/answers'
import useActiveServiceQuery from '../../../api/hooks/useActiveServiceQuery'
import { addDays } from 'date-fns'
import Loader from '../../Loader/Loader'
import { Icon } from '@iconify/react'
import classNames from 'classnames'

const Answers = () => {
  const { data: services, isLoading: loadingServices } = useServicesQuery()
  const { data: activeService } = useActiveServiceQuery()
  const { data: interactions, isLoading: loadingInteractions } =
    useInteractionsQuery({
      serviceId: activeService?.id,
      startDate: addDays(new Date(), -2),
      endDate: addDays(new Date(), -2),
    })
  const dispatch = useDispatch()

  return (
    <div className="Answers">
      <div className="Answers__topbar">
        <div className="Answers__topbar_left">
          <h2 className="Answers__title">Respuestas</h2>
        </div>
        <MenuUsuario />
      </div>
      <main className="Answers__main">
        <div className="Answers__services_tabs">
          {loadingServices ? (
            <Loader />
          ) : (
            services?.map((service) => (
              <button
                key={`tab-service-${service.id}`}
                onClick={() => dispatch(selectService(service.id))}
                className={classNames({
                  Answers__service_tab: true,
                  'Answers__service_tab--active':
                    activeService?.id === service.id,
                })}
              >
                <Icon
                  className="Answers__tab_button_icon"
                  icon="mdi:whatsapp"
                />
                <p className="Answers__tab_label">{service.name}</p>
              </button>
            ))
          )}
        </div>
        <div className="Answers__sidebar">
          <div className="Answers__dashboard">85%</div>
        </div>
        <div className="Answers__table_container">
          {loadingInteractions && <Loader />}
          {interactions && activeService && (
            <InteractionsLegacyTable
              service={activeService}
              interactions={interactions}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default Answers
