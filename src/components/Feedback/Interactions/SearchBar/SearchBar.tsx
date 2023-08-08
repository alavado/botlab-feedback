import { InlineIcon } from '@iconify/react'
import './SearchBar.css'
import { useDispatch } from 'react-redux'
import { setGlobalSearch } from '../../../../redux/ducks/interactions'
import { DebounceInput } from 'react-debounce-input'

const SearchBar = () => {
  const dispatch = useDispatch()

  return (
    <div className="SearchBar">
      <InlineIcon className="SearchBar__icon" icon="mdi:search" />
      <DebounceInput
        className="SearchBar__input"
        placeholder="Buscar..."
        onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
        debounceTimeout={300}
      />
    </div>
  )
}

export default SearchBar
