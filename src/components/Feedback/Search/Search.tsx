import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchQueryResults } from '../../../api/hooks'
import { RootState } from '../../../redux/ducks'
import {
  hideDrawer,
  setActiveInteraction,
  showDrawer,
} from '../../../redux/ducks/search'
import InteractionDrawer from './InteractionDrawer'
import SearchInput from './SearchInput'
import InteractionsTable from './InteractionsTable'
import './Search.css'
import { Interaction } from '../../../api/types/servicio'

const Search = () => {
  const {
    term: searchTerm,
    drawerVisible,
    activeInteraction,
  } = useSelector((state: RootState) => state.search)
  const { data, isLoading } = useSearchQueryResults(searchTerm)
  const dispatch = useDispatch()

  const selectInteraction = (interaction: Interaction) => {
    dispatch(setActiveInteraction(interaction))
    dispatch(showDrawer())
  }

  return (
    <div className="Search">
      <div className="Search__topbar">
        <SearchInput showLoader={isLoading} defaultValue={searchTerm} />
      </div>
      <InteractionsTable data={data || []} onRowClick={selectInteraction} />
      <div
        className={classNames({
          Search__drawer: true,
          'Search__drawer--hidden': !drawerVisible,
        })}
      >
        {activeInteraction && (
          <InteractionDrawer
            interaction={activeInteraction}
            onCloseClick={() => dispatch(hideDrawer())}
          />
        )}
      </div>
    </div>
  )
}

export default Search
