import { useDispatch } from 'react-redux'
import { setTerm as setSearchTerm } from '../../../../redux/ducks/search'
import { DebounceInput } from 'react-debounce-input'
import './SearchInput.css'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import Loader from '../../../Loader'
import classNames from 'classnames'

const SearchInput = ({ showLoader = false }: { showLoader: boolean }) => {
  const dispatch = useDispatch()
  const [debouncing, setDebouncing] = useState(false)
  const [inputContent, setInputContent] = useState('')

  const dispatchSearch = (term: string) => {
    dispatch(setSearchTerm(term))
    setDebouncing(false)
  }

  return (
    <>
      <p className="SearchInput__label">Búsqueda</p>
      <div className="SearchInput">
        <Icon className="SearchInput__icon" icon="mdi:search" />
        <DebounceInput
          value={inputContent}
          autoFocus={true}
          onChange={(e) => {
            setInputContent(e.target.value)
            dispatchSearch(e.target.value)
          }}
          debounceTimeout={300}
          onChangeCapture={() => setDebouncing(true)}
          id="SearchInput__input"
          className="SearchInput__input"
          placeholder="Buscar"
        />
        <div className="SearchInput__status_control">
          {debouncing || showLoader ? (
            <Loader color="var(--color-principal)" />
          ) : (
            <button
              className={classNames({
                SearchInput__clear_button: true,
                'SearchInput__clear_button--hidden': !inputContent,
              })}
              onClick={() => {
                setInputContent('')
              }}
              title="Limpiar búsqueda"
            >
              <Icon className="SearchInput__clear_icon" icon="mdi:close" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchInput
