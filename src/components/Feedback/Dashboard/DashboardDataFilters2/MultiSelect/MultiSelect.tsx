import { Icon } from '@iconify/react'
import './MultiSelect.css'
import OutsideClickHandler from 'react-outside-click-handler'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import {
  MetricFilterByAppointmentProperty,
  MetricFilterByAppointmentPropertyKind,
} from '../../../../../api/hooks/useMetricsFiltersQuery'

const MultiSelect = ({
  property,
}: {
  property: MetricFilterByAppointmentProperty
}) => {
  const [selectorModalVisible, setSelectorModalVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (selectorModalVisible) {
      inputRef.current?.focus()
    }
  }, [selectorModalVisible, selected])

  if (property.kind === MetricFilterByAppointmentPropertyKind.FREEFORM) {
    return null
  }

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
            {selected.map((v) => (
              <span className="MultiSelect__pill">
                {v}{' '}
                <button
                  onClick={() => setSelected(selected.filter((x) => x !== v))}
                >
                  <Icon icon="mdi:close" />
                </button>
              </span>
            ))}

            <input
              className="MultiSelect__freeform_input"
              placeholder={
                selected.length === 0 ? 'Selecciona una o más opciones' : ''
              }
              type="text"
              ref={inputRef}
            />
          </div>
          <div className="MultiSelect__list">
            {property.values.map((value) => (
              <label>
                <input
                  type="checkbox"
                  value={value}
                  checked={selected.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected([...selected, e.target.value as string])
                    } else {
                      setSelected(selected.filter((v) => v !== e.target.value))
                    }
                  }}
                />{' '}
                {value}
              </label>
            ))}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default MultiSelect
