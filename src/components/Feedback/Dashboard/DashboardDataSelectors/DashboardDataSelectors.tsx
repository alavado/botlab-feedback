import { useDispatch, useSelector } from 'react-redux'
import './DashboardDataSelectors.css'
import { RootState } from '../../../../redux/ducks'
import { format, parseISO } from 'date-fns'
import {
  setEndDate,
  setGroupByUnit,
  setSkipEmptyDays,
  setStartDate,
} from '../../../../redux/ducks/dashboard'
import { MetricsTimeSeriesGroupByUnit } from '../../../../api/hooks/useMetricsTimeSeriesQuery'

const DashboardDataSelectors = () => {
  const { startDate, endDate, skipEmptyDays } = useSelector(
    (state: RootState) => state.dashboard
  )
  const dispatch = useDispatch()

  return (
    <div className="DashboardDataSelectors">
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
        >
          <option value="DAY">Día</option>
          <option value="WEEK">Semana</option>
          <option value="MONTH">Mes</option>
        </select>
      </div>
      <div className="DashboardDataSelectors__checkbox_container">
        <input
          type="checkbox"
          id="no-contact-days-checkbox"
          checked={!skipEmptyDays}
          onChange={(e) => setSkipEmptyDays(!e.target.checked)}
        />
        <label
          className="DashboardDataSelectors__field_label"
          htmlFor="no-contact-days-checkbox"
        >
          Considerar días sin contacto
        </label>
      </div>
    </div>
  )
}

export default DashboardDataSelectors
