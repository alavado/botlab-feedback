import { addDays, format, parseISO } from 'date-fns'
import { useState } from 'react'
import MenuUsuario from '../BarraSuperior/MenuUsuario'
import TimeSeriesChart from './TimeSeriesChart/TimeSeriesChart'
import { MetricsTimeSeriesGroupByUnit } from '../../../api/hooks/useMetricsTimeSeriesQuery'
import ProgressDonut from './ProgressDonut'
import './Dashboard.css'
import DownloadDashboardDataButton from './DownloadDashboardDataButton/DownloadDashboardDataButton'

const Dashboard = () => {
  const [startDate, setStartDate] = useState(addDays(new Date(), -7))
  const [endDate, setEndDate] = useState(new Date())
  const [groupDataBy, setGroupDataBy] =
    useState<MetricsTimeSeriesGroupByUnit>('DAY')
  const [skipNoContactDays, setSkipNoContactDays] = useState(false)

  return (
    <div className="Dashboard">
      <div className="Dashboard__topbar">
        <div className="Dashboard__topbar_left">
          <h2 className="Dashboard__title">Dashboard</h2>
        </div>
        <MenuUsuario />
      </div>
      <div className="Dashboard__container">
        <div className="Dashboard__sidebar">
          <div className="Dashboard__field_container">
            <label className="Dashboard__field_label">Desde</label>
            <input
              type="date"
              className="Dashboard__input"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(parseISO(e.target.value))}
            />
          </div>
          <div className="Dashboard__field_container">
            <label className="Dashboard__field_label">Hasta</label>
            <input
              type="date"
              className="Dashboard__input"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={(e) => setEndDate(parseISO(e.target.value))}
            />
          </div>
          <div className="Dashboard__field_container">
            <label className="Dashboard__field_label">Agrupar por</label>
            <select
              onChange={(e) =>
                setGroupDataBy(e.target.value as MetricsTimeSeriesGroupByUnit)
              }
              className="Dashboard__input"
            >
              <option value="DAY">Día</option>
              <option value="WEEK">Semana</option>
              <option value="MONTH">Mes</option>
            </select>
          </div>
          <div className="Dashboard__checkbox_container">
            <input
              type="checkbox"
              id="no-contact-days-checkbox"
              checked={!skipNoContactDays}
              onChange={(e) => setSkipNoContactDays(!e.target.checked)}
            />
            <label
              className="Dashboard__field_label"
              htmlFor="no-contact-days-checkbox"
            >
              Considerar días sin contacto
            </label>
          </div>
          <DownloadDashboardDataButton
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="Dashboard__top_charts">
          <ProgressDonut
            startDate={startDate}
            endDate={endDate}
            metric="TOTAL"
          />
          <ProgressDonut
            startDate={startDate}
            endDate={endDate}
            metric="ANSWERED"
          />
        </div>
        <div className="Dashboard__chart">
          <TimeSeriesChart
            startDate={startDate}
            endDate={endDate}
            groupBy={groupDataBy}
            skipNoContactDays={skipNoContactDays}
          />
        </div>
        {/* <div className="Dashboard__big_numbers">
          <div
            className="Dashboard__big_number"
            style={{ backgroundColor: 'rgba(255, 99, 132, 1)' }}
          >
            <figure>
              {data.reduce((acc: any, v: any) => acc + v.total, 0)}
            </figure>
            <p>Contactadas</p>
          </div>
          <div
            className="Dashboard__big_number"
            style={{ backgroundColor: 'rgba(53, 162, 235, 1)' }}
          >
            <figure>
              {data.reduce((acc: any, v: any) => acc + v.answered, 0)}
            </figure>
            <p>Respondidas</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Dashboard
