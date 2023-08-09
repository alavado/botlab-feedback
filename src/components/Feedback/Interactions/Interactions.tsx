import MenuUsuario from '../BarraSuperior/MenuUsuario/MenuUsuario'
import useInteractionsQuery from '../../../api/hooks/useInteractionsQuery'
import InteractionsLegacyTable from './InteractionsLegacyTable/InteractionsLegacyTable'
import Loader from '../../Loader/Loader'
import MiniDashboard from './MiniDashboard'
import InteractionDrawerCover from '../InteractionDrawer/InteractionDrawerCover/InteractionDrawerCover'
import { useRouteMatch } from 'react-router-dom'
import useActiveServiceQuery from '../../../api/hooks/useActiveServiceQuery'
import InteractionFilters from './InteractionFilters/InteractionFilters'
import ServiceSelector from './ServiceSelector/ServiceSelector'
import './Interactions.css'
import DateRangeSelector from './DateRangeSelector/DateRangeSelector'
import SearchBar from './SearchBar/SearchBar'
import { Interaction } from '../../../api/types/domain'

const Interactions = () => {
  const { data: interactions, isLoading: loadingInteractions } =
    useInteractionsQuery({ applyFilters: true })
  const { data: activeService } = useActiveServiceQuery()
  const { params }: any = useRouteMatch()

  return (
    <div className="Interactions">
      <InteractionDrawerCover visible={params?.patientId} />
      <div className="Interactions__topbar">
        <div className="Interactions__topbar_left">
          <h2 className="Interactions__title">Interacciones</h2>
          <DateRangeSelector />
          <SearchBar />
        </div>
        <MenuUsuario />
      </div>
      <main className="Interactions__main">
        <ServiceSelector />
        <aside className="Interactions__sidebar">
          <MiniDashboard />
          <InteractionFilters />
        </aside>
        <div className="Interactions__table_container">
          {loadingInteractions && <Loader />}
          {interactions && activeService && (
            <InteractionsLegacyTable
              interactions={interactions as Interaction[]}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default Interactions
