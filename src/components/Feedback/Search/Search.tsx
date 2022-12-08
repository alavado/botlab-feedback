import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchQueryResults } from '../../../api/hooks'
import { RootState } from '../../../redux/ducks'
import { hideDrawer, showDrawer } from '../../../redux/ducks/search'
import InteractionDrawer from './InteractionDrawer'
import './Search.css'
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'

const Search = () => {

  const { term: searchTerm, drawerVisible } = useSelector((state: RootState) => state.search)
  const { data, isLoading }  = useSearchQueryResults(searchTerm)
  const dispatch = useDispatch()

  return (
    <div className="Search">
      <div className="Search__topbar">
        <SearchInput showLoader={isLoading} />
      </div>
      <SearchResults
        data={data || []}
        onRowClick={() => dispatch(showDrawer())}
      />
      <div
        className={classNames({
          "Search__drawer": true,
          "Search__drawer--hidden": !drawerVisible,
        })}
      >
        <InteractionDrawer
          onCloseClick={() => dispatch(hideDrawer())}
        />
      </div>
    </div>
  )
}

export default Search