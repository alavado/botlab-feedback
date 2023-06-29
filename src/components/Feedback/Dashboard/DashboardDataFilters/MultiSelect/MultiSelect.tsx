import { Icon } from '@iconify/react'
import './MultiSelect.css'
import { useEffect, useRef, useState } from 'react'
import { MetricFilterByAppointmentProperty } from '../../../../../api/hooks/useMetricsFiltersQuery'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'
import { removeFilter } from '../../../../../redux/ducks/dashboard'
import { getPillStyle } from './utils'
import _ from 'lodash'
import MultiSelectList from './MultiSelectList/MultiSelectList'

const MultiSelect = ({
  property,
}: {
  property: MetricFilterByAppointmentProperty
}) => {
  const [selectorModalVisible, setSelectorModalVisible] = useState(false)
  const { filters } = useSelector((state: RootState) => state.dashboard)
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  const propertyFilters =
    filters === 'EVERYTHING'
      ? []
      : filters.filter((f) => f.property.id === property.id)

  useEffect(() => {
    if (selectorModalVisible) {
      inputRef.current?.focus()
    }
  }, [selectorModalVisible])

  return (
    <div className="MultiSelect">
      <div
        className="MultiSelect__button"
        onClick={() => {
          setSelectorModalVisible(!selectorModalVisible)
        }}
      >
        <div>
          <Icon icon="mdi:arrow-down-drop-circle" />
          {property.label}
        </div>
        <div className="MultiSelect__freeform_input_container">
          {propertyFilters.map(({ value }) => (
            <span className="MultiSelect__pill" style={getPillStyle(value)}>
              {value}{' '}
              <button
                onClick={() => dispatch(removeFilter({ property, value }))}
                title={`Remover "${value}"`}
              >
                <Icon icon="mdi:close" />
              </button>
            </span>
          ))}
          <input
            className="MultiSelect__freeform_input"
            placeholder={
              _.isEmpty(propertyFilters) ? 'Selecciona una o más opciones' : ''
            }
            type="text"
            ref={inputRef}
          />
        </div>
      </div>
      <MultiSelectList
        onOutsideClick={() => setSelectorModalVisible(false)}
        property={property}
        onValueAdded={() => inputRef.current?.focus()}
        visible={selectorModalVisible}
      />
    </div>
  )
}

export default MultiSelect
