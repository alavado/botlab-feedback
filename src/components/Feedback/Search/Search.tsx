import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/ducks'
import {
  hideDrawer,
  setActiveInteraction,
  showDrawer,
} from '../../../redux/ducks/search'
import InteractionDrawer from '../InteractionDrawer'
import SearchInput from './SearchInput'
import InteractionsTable from '../InteractionsTable'
import './Search.css'
import { Interaction } from '../../../api/types/domain'
import useAnalytics from '../../../hooks/useAnalytics'
import useSearchQuery from '../../../api/hooks/useSearchQuery'
import { Icon } from '@iconify/react'
import MenuUsuario from '../BarraSuperior/MenuUsuario'

const Search = () => {
  const {
    term: searchTerm,
    drawerVisible,
    activeInteraction,
  } = useSelector((state: RootState) => state.search)
  const { data, isLoading } = useSearchQuery(searchTerm)
  const dispatch = useDispatch()
  const track = useAnalytics()

  const selectInteraction = (interaction: Interaction) => {
    dispatch(setActiveInteraction(interaction))
    dispatch(showDrawer())
    track('Feedback', 'Search', 'rowClick')
  }

  return (
    <div className="Search">
      <div className="Search__topbar">
        <SearchInput showLoader={isLoading} defaultValue={searchTerm} />
        <MenuUsuario />
      </div>
      <InteractionsTable
        data={data || []}
        onRowClick={selectInteraction}
        highlighted={activeInteraction}
      />
      {!searchTerm && (
        <p className="Search__message Search__message--instructions">
          <Icon icon="mdi:arrow-up" /> Escribe para buscar por teléfono, RUT o
          nombre de paciente
        </p>
      )}
      {searchTerm && data?.length === 0 && (
        <p className="Search__message Search__message--empty-result">
          <Icon icon="mdi:shimmer" /> No se encontraron resultados para "
          {searchTerm}"
        </p>
      )}
      <div
        className={classNames({
          Search__drawer: true,
          'Search__drawer--hidden': !drawerVisible,
        })}
      >
        {activeInteraction && (
          <InteractionDrawer
            interactionId={activeInteraction.id}
            onCloseClick={() => {
              dispatch(hideDrawer())
              track('Feedback', 'Search', 'hideDrawer')
            }}
            originComponentName="Search"
          />
        )}
      </div>
    </div>
  )
}

export default Search
