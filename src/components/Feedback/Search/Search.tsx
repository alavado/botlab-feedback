import { useSelector } from 'react-redux'
import { useSearchQueryResults } from '../../../api/hooks'
import { RootState } from '../../../redux/ducks'
import './Search.css'
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'

const Search = () => {

  const { term: searchTerm } = useSelector((state: RootState) => state.search)
  const { data, isLoading }  = useSearchQueryResults(searchTerm)

  return (
    <div className="Search">
      <SearchInput showLoader={isLoading} />
      <SearchResults data={data || []} />
    </div>
  )
}

export default Search