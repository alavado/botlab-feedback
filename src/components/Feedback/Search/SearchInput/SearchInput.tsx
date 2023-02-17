import { useDispatch } from 'react-redux'
import { setTerm as setSearchTerm } from '../../../../redux/ducks/search'
import { DebounceInput } from 'react-debounce-input'
import './SearchInput.css'
import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import Loader from '../../../Loader'
import classNames from 'classnames'
import useAnalytics from '../../../../hooks/useAnalytics'

interface SearchInputProps {
  showLoader: boolean
  defaultValue: string
}

const SearchInput = ({
  showLoader = false,
  defaultValue = '',
}: SearchInputProps) => {
  const dispatch = useDispatch()
  const [debouncing, setDebouncing] = useState(false)
  const [inputContent, setInputContent] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const track = useAnalytics()

  const dispatchSearch = (term: string) => {
    dispatch(setSearchTerm(term))
    setDebouncing(false)
    track('Feedback', 'Search', 'search')
  }

  const clearSearchInput = () => {
    setInputContent('')
    dispatch(setSearchTerm(''))
    inputRef.current?.focus()
  }

  return (
    <div className="SearchInput">
      <label htmlFor="SearchInput__input" className="SearchInput__label">
        Búsqueda
      </label>
      <div className="SearchInput__input_container">
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
          onPaste={(e: any) =>
            track('Feedback', 'Search', 'paste', {
              text: e.clipboardData.getData('text'),
            })
          }
          id="SearchInput__input"
          className="SearchInput__input"
          placeholder="Buscar"
          inputRef={inputRef}
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
              onClick={clearSearchInput}
              title="Limpiar búsqueda"
            >
              <Icon className="SearchInput__clear_icon" icon="mdi:close" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchInput
