import { Icon } from '@iconify/react'
import useMetricsFiltersQuery, {
  MetricFilterByAppointmentPropertyKind,
} from '../../../../api/hooks/useMetricsFiltersQuery'
import './DashboardDataFilters.css'
import { useDispatch } from 'react-redux'
import { addFilter, clearFilter } from '../../../../redux/ducks/dashboard'
import { DebounceInput } from 'react-debounce-input'
import Loader from '../../../Loader/Loader'

const DashboardDataFilters = () => {
  const { data, isLoading } = useMetricsFiltersQuery()
  const dispatch = useDispatch()

  return (
    <div className="DashboardDataFilters">
      <h3 className="DashboardDataFilters__title">
        <Icon icon="mdi:filter" />
        Filtros
      </h3>
      {isLoading ? (
        <Loader />
      ) : (
        data?.map((property) => (
          <label
            key={`DashboardDataFilter-${property.id}`}
            className="DashboardDataFilters__label"
          >
            {property.label}
            {property.kind === MetricFilterByAppointmentPropertyKind.LEVELS ? (
              <select
                className="DashboardDataFilters__input"
                onChange={(e) => {
                  const value = e.target.value
                  if (value === 'ALL') {
                    dispatch(clearFilter({ property }))
                  } else {
                    dispatch(
                      addFilter({
                        property,
                        value,
                        multiLevel: false,
                      })
                    )
                  }
                }}
              >
                <option value="ALL">Todas</option>
                {property.values.map((v, i) => (
                  <option
                    key={`DashboardDataFilters-option-${property.id}-${i}`}
                    value={v}
                  >
                    {v}
                  </option>
                ))}
              </select>
            ) : (
              <DebounceInput
                className="DashboardDataFilters__input"
                onChange={(e) =>
                  dispatch(
                    addFilter({
                      property,
                      value: e.target.value,
                      multiLevel: false,
                    })
                  )
                }
                debounceTimeout={300}
              />
            )}
          </label>
        ))
      )}
    </div>
  )
}

export default DashboardDataFilters
