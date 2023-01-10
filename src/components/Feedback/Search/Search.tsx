import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
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
import useAnalytics from '../../../hooks/useAnalytics'
import useSearchQuery from '../../../api/hooks/useSearchQuery'

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
      </div>
      <InteractionsTable
        data={data || []}
        onRowClick={selectInteraction}
        highlighted={activeInteraction}
      />
      <div
        className={classNames({
          Search__drawer: true,
          'Search__drawer--hidden': !drawerVisible,
        })}
      >
        {activeInteraction && (
          <InteractionDrawer
            pollId={activeInteraction.pollId}
            userId={activeInteraction.userId}
            start={activeInteraction.start}
            onPreviousClick={() => {}}
            onNextClick={() => {}}
            onCloseClick={() => {
              dispatch(hideDrawer())
              track('Feedback', 'Search', 'hideDrawer')
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Search
