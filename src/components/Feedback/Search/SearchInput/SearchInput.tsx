import { useDispatch } from 'react-redux'
import { setTerm as setSearchTerm } from '../../../../redux/ducks/search'
import { DebounceInput } from 'react-debounce-input'
import './SearchInput.css'
import { useState } from 'react'
import { Icon } from '@iconify/react'

const SearchInput = ({ showLoader = false } : { showLoader: boolean }) => {

  const dispatch = useDispatch()
  const [debouncing, setDebouncing] = useState(false)

  const dispatchSearch = (term: string) => {
    dispatch(setSearchTerm(term))
    setDebouncing(false)
  }

  return (
    <>
      <p className="SearchInput__label">Búsqueda</p>
      <div className="SearchInput">
        <Icon className="SearchInput__icon" icon="mdi:search"/>
        <DebounceInput
          autoFocus={true}
          onChange={e => dispatchSearch(e.target.value)}
          debounceTimeout={300}
          onChangeCapture={() => setDebouncing(true)}
          id="SearchInput__input"
          className="SearchInput__input"
          placeholder="Buscar"
        />
        {(debouncing || showLoader) && 'cargando...'}
      </div>
    </>
  )
}

export default SearchInput