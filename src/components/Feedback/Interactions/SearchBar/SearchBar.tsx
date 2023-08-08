import { InlineIcon } from '@iconify/react'
import './SearchBar.css'

const SearchBar = () => {
  return (
    <div className="SearchBar">
      <InlineIcon className="SearchBar__icon" icon="mdi:search" />
      <input className="SearchBar__input" placeholder="Buscar..." />
    </div>
  )
}

export default SearchBar
