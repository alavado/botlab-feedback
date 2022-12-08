import { useDispatch } from 'react-redux'
import { setTerm as setSearchTerm } from '../../../../redux/ducks/search'
import { DebounceInput } from 'react-debounce-input'
import './SearchInput.css'
import { useState } from 'react'

const SearchInput = ({ showLoader = false } : { showLoader: boolean }) => {

  const dispatch = useDispatch()
  const [debouncing, setDebouncing] = useState(false)

  const dispatchSearch = (term: string) => {
    dispatch(setSearchTerm(term))
    setDebouncing(false)
  }

  return (
    <div className="SearchInput">
      <label
        className="SearchInput__label"
        htmlFor="SearchInput__input"
      >
        Buscar: 
      </label>
      <DebounceInput
        autoFocus={true}
        onChange={e => dispatchSearch(e.target.value)}
        debounceTimeout={300}
        onChangeCapture={() => setDebouncing(true)}
        id="SearchInput__input"
      />
      {(debouncing || showLoader) && 'cargando...'}
    </div>
  )
}

export default SearchInput