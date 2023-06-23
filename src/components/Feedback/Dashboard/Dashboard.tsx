import MenuUsuario from '../BarraSuperior/MenuUsuario'
import TimeSeriesChart from './TimeSeriesChart/TimeSeriesChart'
import ProgressDonut from './ProgressDonut'
import DownloadDashboardDataButton from './DownloadDashboardDataButton/DownloadDashboardDataButton'
import DashboardDataSelectors from './DashboardDataSelectors/DashboardDataSelectors'
import DashboardDataFilters from './DashboardDataFilters/DashboardDataFilters'
import './Dashboard.css'
import DashboardDataFilters2 from './DashboardDataFilters2/DashboardDataFilters2'

const Dashboard = () => {
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
          <DashboardDataSelectors />
          {/* <DashboardDataFilters /> */}
          <DashboardDataFilters2 />
          <DownloadDashboardDataButton />
        </div>
        <div className="Dashboard__top_charts">
          <ProgressDonut metric="TOTAL" />
          <ProgressDonut metric="ANSWERED" />
        </div>
        <div className="Dashboard__chart_container">
          <TimeSeriesChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
