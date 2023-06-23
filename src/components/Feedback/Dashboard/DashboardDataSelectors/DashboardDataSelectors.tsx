import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import { format, parseISO } from 'date-fns'
import {
  setEndDate,
  setGroupByUnit,
  setIncludeSaturdays,
  setIncludeSundays,
  setIncludeWeekends,
  setStartDate,
} from '../../../../redux/ducks/dashboard'
import { MetricsTimeSeriesGroupByUnit } from '../../../../api/hooks/useMetricsTimeSeriesQuery'
import './DashboardDataSelectors.css'

const DashboardDataSelectors = () => {
  const {
    start: startDate,
    end: endDate,
    groupBy,
    includeWeekends,
    includeSaturdays,
    includeSundays,
  } = useSelector((state: RootState) => state.dashboard)
  const dispatch = useDispatch()

  return (
    <div className="DashboardDataSelectors">
      <div className="DashboardDataSelectors__field_container">
        <label className="DashboardDataSelectors__field_label">
          Agrupar por
        </label>
        <select
          onChange={(e) =>
            dispatch(
              setGroupByUnit(e.target.value as MetricsTimeSeriesGroupByUnit)
            )
          }
          className="DashboardDataSelectors__input"
          value={groupBy}
        >
          <option value="DAY">Día</option>
          <option value="WEEK">Semana</option>
          <option value="MONTH">Mes</option>
        </select>
      </div>
      <div className="DashboardDataSelectors__field_container">
        <label className="DashboardDataSelectors__field_label">Desde</label>
        <input
          type="date"
          className="DashboardDataSelectors__input"
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={(e) => dispatch(setStartDate(parseISO(e.target.value)))}
        />
      </div>
      <div className="DashboardDataSelectors__field_container">
        <label className="DashboardDataSelectors__field_label">Hasta</label>
        <input
          type="date"
          className="DashboardDataSelectors__input"
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => dispatch(setEndDate(parseISO(e.target.value)))}
        />
      </div>
      {groupBy === 'DAY' && (
        <div className="DashboardDataSelectors__checkboxes_container">
          <div className="DashboardDataSelectors__checkbox_container">
            <input
              type="checkbox"
              id="include-weekends-checkbox"
              checked={includeWeekends}
              onChange={(e) => dispatch(setIncludeWeekends(e.target.checked))}
            />
            <label
              className="DashboardDataSelectors__field_label"
              htmlFor="include-weekends-checkbox"
            >
              Incluir fines de semana
            </label>
          </div>
          <div className="DashboardDataSelectors__checkbox_container DashboardDataSelectors__checkbox_container--secondary">
            <input
              type="checkbox"
              id="include-saturdays-checkbox"
              checked={includeSaturdays}
              onChange={(e) => dispatch(setIncludeSaturdays(e.target.checked))}
            />
            <label
              className="DashboardDataSelectors__field_label"
              htmlFor="include-saturdays-checkbox"
            >
              Incluir sábados
            </label>
          </div>
          <div className="DashboardDataSelectors__checkbox_container DashboardDataSelectors__checkbox_container--secondary">
            <input
              type="checkbox"
              id="include-sundays-checkbox"
              checked={includeSundays}
              onChange={(e) => dispatch(setIncludeSundays(e.target.checked))}
            />
            <label
              className="DashboardDataSelectors__field_label"
              htmlFor="include-sundays-checkbox"
            >
              Incluir domingos
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardDataSelectors
