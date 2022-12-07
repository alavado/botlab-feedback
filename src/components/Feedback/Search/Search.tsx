import { useSelector } from 'react-redux'
import { useSearchQueryResults } from '../../../api/hooks'
import { Interaction } from '../../../api/types/servicio'
import { RootState } from '../../../redux/ducks'
import './Search.css'
import SearchInput from './SearchInput'

const Search = () => {

  const { term: searchTerm } = useSelector((state: RootState) => state.search)
  const { data, isLoading }  = useSearchQueryResults(searchTerm)

  return (
    <div className="Search">
      <SearchInput loadingResults={isLoading} />
      <div>
        {data?.map((interaction: Interaction) => (
          <div>{interaction.phone}</div>
        ))}
      </div>
    </div>
  )
}

export default Search