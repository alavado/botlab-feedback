import classNames from 'classnames'
import './MultiSelectList.css'
import OutsideClickHandler from 'react-outside-click-handler'
import { useSelector } from 'react-redux'
import { MetricFilterByAppointmentProperty } from '../../../../../../api/hooks/useMetricsFiltersQuery'
import { getPillStyle } from '../utils'
import { RootState } from '../../../../../../redux/ducks'
import { Icon } from '@iconify/react'

const MultiSelectList = ({
  propertyId,
  values,
  visible,
  onOutsideClick,
  onAddFilter,
  onRemoveFilter,
}: {
  propertyId: MetricFilterByAppointmentProperty['id']
  values: string[]
  visible: boolean
  onAddFilter: ({ value }: { value: string }) => void
  onRemoveFilter: ({ value }: { value: string }) => void
  onOutsideClick: (x: MouseEvent) => void
}) => {
  const { filters } = useSelector((state: RootState) => state.dashboard)

  const propertyFilters =
    filters === 'EVERYTHING'
      ? []
      : filters.filter((f) => f.propertyId === propertyId)

  return (
    <OutsideClickHandler disabled={!visible} onOutsideClick={onOutsideClick}>
      <div
        className={classNames({
          MultiSelectList__container: true,
          'MultiSelectList__container--visible': visible,
        })}
      >
        <div className="MultiSelectList">
          {values.length > 0 ? (
            values.map((value) => (
              <label
                className="MultiSelectList__element"
                key={`MultiSelectList__${propertyId}_${value}`}
              >
                <Icon icon="mdi:plus" style={{ opacity: 0.65 }} />
                <input
                  type="checkbox"
                  value={value}
                  checked={propertyFilters.some((f) => f.value === value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onAddFilter({ value })
                    } else {
                      onRemoveFilter({ value })
                    }
                  }}
                  style={{ display: 'none' }}
                />{' '}
                <span
                  className="MultiSelectList__value"
                  style={getPillStyle(value)}
                >
                  {value}
                </span>
              </label>
            ))
          ) : (
            <p className="MultiSelectList__no_results">No hay resultados</p>
          )}
        </div>
      </div>
    </OutsideClickHandler>
  )
}

export default MultiSelectList
