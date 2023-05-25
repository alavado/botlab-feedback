import { useDispatch, useSelector } from 'react-redux'
import useServicesQuery from '../../../api/hooks/useServicesQuery'
import MenuUsuario from '../BarraSuperior/MenuUsuario/MenuUsuario'
import './Answers.css'
import { RootState } from '../../../redux/ducks'
import useInteractionsQuery from '../../../api/hooks/useInteractionsQuery'
import InteractionsLegacyTable from './InteractionsLegacyTable/InteractionsLegacyTable'
import { selectService } from '../../../redux/ducks/answers'

const Answers = () => {
  const { data: services, isLoading } = useServicesQuery()
  const { activeServiceId } = useSelector((state: RootState) => state.answers)
  const { data: interactions, isLoading: loadingInteractions } =
    useInteractionsQuery({
      serviceId: activeServiceId,
      startDate: new Date(),
      endDate: new Date(),
    })
  const dispatch = useDispatch()

  console.log({ interactions })

  return (
    <div className="Answers">
      <div className="Answers__topbar">
        <div className="Answers__topbar_left">
          <h2 className="Answers__title">Respuestas</h2>
        </div>
        <MenuUsuario />
      </div>
      <main className="Answers__main">
        <div>
          {services?.map((service) => (
            <button onClick={() => dispatch(selectService(service.id))}>
              {service.name}
            </button>
          ))}
        </div>
        <div>
          {interactions && (
            <InteractionsLegacyTable interactions={interactions} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Answers
