import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import { MetricFilterByAppointmentProperty } from '../../../../../api/hooks/useMetricsFiltersQuery'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'
import { removeFilter } from '../../../../../redux/ducks/dashboard'
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
