import { useDispatch, useSelector } from 'react-redux'
import useServicesQuery from '../../../api/hooks/useServicesQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario/MenuUsuario'
import './Answers.css'
import useInteractionsQuery from '../../../api/hooks/useInteractionsQuery'
import InteractionsLegacyTable from './InteractionsLegacyTable/InteractionsLegacyTable'
import { selectService } from '../../../redux/ducks/answers'
import useActiveServiceQuery from '../../../api/hooks/useActiveServiceQuery'
import { addDays } from 'date-fns'
import Loader from '../../Loader/Loader'

const Answers = () => {
  const { data: services, isLoading } = useServicesQuery()
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
          {isLoading ? (
            <p>cargando...</p>
          ) : (
            services?.map((service) => (
              <button onClick={() => dispatch(selectService(service.id))}>
                {service.name}
              </button>
            ))
          )}
        </div>
        <div className="Answers__dashboard"></div>
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
