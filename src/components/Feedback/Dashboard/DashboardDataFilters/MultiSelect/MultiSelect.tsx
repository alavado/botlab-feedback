import { Icon } from '@iconify/react'
import './MultiSelect.css'
import OutsideClickHandler from 'react-outside-click-handler'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import {
  MetricFilterByAppointmentProperty,
  MetricFilterByAppointmentPropertyKind,
} from '../../../../../api/hooks/useMetricsFiltersQuery'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'
import { addFilter, removeFilter } from '../../../../../redux/ducks/dashboard'
import { getHueForLabel, getPillStyle } from './utils'
import _ from 'lodash'

const MultiSelect = ({
  property,
}: {
  property: MetricFilterByAppointmentProperty
}) => {
  const [selectorModalVisible, setSelectorModalVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { filters } = useSelector((state: RootState) => state.dashboard)
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

  return (
    <div className="MultiSelect">
      <div
        className="MultiSelect__button"
        onClick={() => {
          setSelectorModalVisible(!selectorModalVisible)
        }}
      >
        <span style={{ display: 'flex', gap: '.15rem' }}>
          <Icon icon="mdi:arrow-down-drop-circle" />
          {property.label}
        </span>{' '}
        <Icon icon="mdi:chevron-down" />
      </div>
      <OutsideClickHandler
        disabled={!selectorModalVisible}
        onOutsideClick={(e: MouseEvent) => {
          setSelectorModalVisible(false)
        }}
      >
        <div
          className={classNames({
            MultiSelect__list_container: true,
            'MultiSelect__list_container--visible': selectorModalVisible,
          })}
        >
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
                _.isEmpty(propertyFilters)
                  ? 'Selecciona una o más opciones'
                  : ''
              }
              type="text"
              ref={inputRef}
            />
          </div>
          <div className="MultiSelect__list">
            {property.values.map((value) => (
              <label className="MultiSelect__list_element">
                <input
                  type="checkbox"
                  value={value}
                  checked={propertyFilters.some((f) => f.value === value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch(addFilter({ property, value }))
                    } else {
                      dispatch(removeFilter({ property, value }))
                    }
                    inputRef.current?.focus()
                  }}
                />{' '}
                <span
                  className="MultiSelect__list_value"
                  style={getPillStyle(value)}
                >
                  {value}
                </span>
              </label>
            ))}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default MultiSelect
