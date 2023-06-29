import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import {
  MetricFilterByAppointmentProperty,
  MetricFilterByAppointmentPropertyKind,
} from '../../../../../api/hooks/useMetricsFiltersQuery'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'
import { addFilter, removeFilter } from '../../../../../redux/ducks/dashboard'
import MultiSelectList from './MultiSelectList/MultiSelectList'
import MultiSelectPill from './MultiSelectPill/MultiSelectPill'
import _ from 'lodash'
import classNames from 'classnames'
import './MultiSelect.css'

const MultiSelect = ({
  property,
}: {
  property: MetricFilterByAppointmentProperty
}) => {
  const [selectorModalVisible, setSelectorModalVisible] = useState(false)
  const { filters } = useSelector((state: RootState) => state.dashboard)
  const [localTextFilter, setLocalTextFilter] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectorModalVisible) {
      inputRef.current?.focus()
    }
  }, [selectorModalVisible])

  if (property.kind === MetricFilterByAppointmentPropertyKind.FREEFORM) {
    return null
  }

  const propertyFilters =
    filters === 'EVERYTHING'
      ? []
      : filters.filter((f) => f.property.id === property.id)

  const filteredValues = property.values.filter(
    (v) =>
      !propertyFilters.some((f) => f.value === v) &&
      v
        .toLocaleLowerCase('de-DE')
        .includes(localTextFilter.toLocaleLowerCase('de-ES'))
  )

  return (
    <div className="MultiSelect">
      <div className="MultiSelect__field">
        <div className="MultiSelect__label">
          <Icon icon="mdi:filter" />
          {property.label}
        </div>
        <div
          className="MultiSelect__input_container"
          onClick={() => {
            setSelectorModalVisible(!selectorModalVisible)
          }}
        >
          {propertyFilters.map(({ value }) => (
            <MultiSelectPill
              key={`MultiSelectPill-${value}`}
              label={value}
              onRemove={() => dispatch(removeFilter({ property, value }))}
            />
          ))}
          <input
            className={classNames({
              MultiSelect__input: true,
              'MultiSelect__input--hidden':
                !selectorModalVisible && propertyFilters.length > 0,
            })}
            placeholder={
              _.isEmpty(propertyFilters) ? `Buscar ${property.label}` : ''
            }
            type="text"
            ref={inputRef}
            value={localTextFilter}
            onChange={(e) => setLocalTextFilter(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setLocalTextFilter('')
                if (_.isEmpty(filteredValues)) {
                  return
                }
                dispatch(addFilter({ property, value: filteredValues[0] }))
              }
            }}
          />
        </div>
      </div>
      <MultiSelectList
        property={property}
        values={filteredValues}
        onOutsideClick={() => setSelectorModalVisible(false)}
        onAddFilter={({ value }: { value: string }) => {
          dispatch(addFilter({ property, value }))
          setLocalTextFilter('')
          inputRef.current?.focus()
        }}
        onRemoveFilter={({ value }: { value: string }) => {
          dispatch(removeFilter({ property, value }))
        }}
        visible={selectorModalVisible}
      />
    </div>
  )
}

export default MultiSelect
