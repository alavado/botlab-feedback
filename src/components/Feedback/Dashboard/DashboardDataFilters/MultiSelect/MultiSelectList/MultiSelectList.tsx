import classNames from 'classnames'
import './MultiSelectList.css'
import OutsideClickHandler from 'react-outside-click-handler'
import { useDispatch, useSelector } from 'react-redux'
import {
  addFilter,
  removeFilter,
} from '../../../../../../redux/ducks/dashboard'
import {
  MetricFilterByAppointmentProperty,
  MetricFilterByAppointmentPropertyKind,
} from '../../../../../../api/hooks/useMetricsFiltersQuery'
import { getPillStyle } from '../utils'
import { RootState } from '../../../../../../redux/ducks'

const MultiSelectList = ({
  property,
  visible,
  onOutsideClick,
  onValueAdded,
}: {
  property: MetricFilterByAppointmentProperty
  visible: boolean
  onOutsideClick: (x: MouseEvent) => void
  onValueAdded: () => void
}) => {
  const dispatch = useDispatch()
  const { filters } = useSelector((state: RootState) => state.dashboard)

  if (property.kind === MetricFilterByAppointmentPropertyKind.FREEFORM) {
    return null
  }

  const propertyFilters =
    filters === 'EVERYTHING'
      ? []
      : filters.filter((f) => f.property.id === property.id)

  return (
    <OutsideClickHandler disabled={!visible} onOutsideClick={onOutsideClick}>
      <div
        className={classNames({
          MultiSelect__list_container: true,
          'MultiSelect__list_container--visible': visible,
        })}
      >
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
                  onValueAdded()
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
  )
}

export default MultiSelectList
