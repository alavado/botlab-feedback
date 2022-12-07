import { useDispatch } from 'react-redux'
import { setTerm as setSearchTerm } from '../../../../redux/ducks/search'
import { DebounceInput } from 'react-debounce-input'
import './SearchInput.css'
import { useState } from 'react'

const SearchInput = ({ loadingResults } : { loadingResults: boolean }) => {

  const dispatch = useDispatch()
  const [debouncing, setDebouncing] = useState(false)

  return (
    <div className="SearchInput">
      <DebounceInput
        onChange={e => {
          dispatch(setSearchTerm(e.target.value))
          setDebouncing(false)
        }}
        debounceTimeout={300}
        onChangeCapture={() => setDebouncing(true)}
      />
      {(debouncing || loadingResults) && 'cargando...'}
    </div>
  )
}

export default SearchInput