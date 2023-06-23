import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import {
  endOfMonth,
  endOfWeek,
  format,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import {
  setEndDate,
  setGroupByUnit,
  setIncludeSaturdays,
  setIncludeSundays,
  setIncludeWeekends,
  setStartDate,
} from '../../../../redux/ducks/dashboard'
import { MetricsTimeSeriesTimeUnit } from '../../../../api/hooks/useMetricsTimeSeriesQuery'
import './DashboardDataSelectors.css'

const getInputType = (unit: MetricsTimeSeriesTimeUnit): string => {
  switch (unit) {
    case 'MONTH':
      return 'month'
    case 'WEEK':
      return 'week'
    default:
      return 'date'
  }
}

const getDateFormat = (unit: MetricsTimeSeriesTimeUnit): string => {
  switch (unit) {
    case 'MONTH':
      return 'yyyy-MM'
    case 'WEEK':
      return "yyyy-'W'II"
    default:
      return 'yyyy-MM-dd'
  }
}

const getDateFromFormattedDate = (
  unit: MetricsTimeSeriesTimeUnit,
  formattedDate: string,
  bound: 'START' | 'END'
): Date => {
  switch (unit) {
    case 'MONTH':
      const monthDate = parse(formattedDate, 'yyyy-MM', new Date())
      if (bound === 'START') {
        return startOfMonth(monthDate)
      }
      return endOfMonth(monthDate)
    case 'WEEK':
      const [year, week] = formattedDate.split('-W')
      const yearDate = parse(year, 'yyyy', new Date())
      const yearAndWeekDate = parse(week, 'II', yearDate)
      if (bound === 'START') {
        startOfWeek(yearAndWeekDate)
      }
      return endOfWeek(yearAndWeekDate)
    default:
      return parseISO(formattedDate)
  }
}

const DashboardDataSelectors = () => {
  const {
    start: startDate,
    end: endDate,
    timeUnit,
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
              setGroupByUnit(e.target.value as MetricsTimeSeriesTimeUnit)
            )
          }
          className="DashboardDataSelectors__input"
          value={timeUnit}
        >
          <option value="DAY">Día</option>
          <option value="WEEK">Semana</option>
          <option value="MONTH">Mes</option>
        </select>
      </div>
      <div className="DashboardDataSelectors__field_container">
        <label className="DashboardDataSelectors__field_label">Desde</label>
        <input
          type={getInputType(timeUnit)}
          className="DashboardDataSelectors__input"
          value={format(startDate, getDateFormat(timeUnit))}
          onChange={(e) => {
            const startDate = getDateFromFormattedDate(
              timeUnit,
              e.target.value,
              'START'
            )
            dispatch(setStartDate(startDate))
          }}
        />
      </div>
      <div className="DashboardDataSelectors__field_container">
        <label className="DashboardDataSelectors__field_label">Hasta</label>
        <input
          type={getInputType(timeUnit)}
          className="DashboardDataSelectors__input"
          value={format(endDate, getDateFormat(timeUnit))}
          onChange={(e) => {
            const endDate = getDateFromFormattedDate(
              timeUnit,
              e.target.value,
              'END'
            )
            dispatch(setEndDate(endDate))
          }}
        />
      </div>
      {timeUnit === 'DAY' && (
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
