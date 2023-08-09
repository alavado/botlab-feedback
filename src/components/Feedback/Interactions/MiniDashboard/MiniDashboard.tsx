import { CSSProperties } from 'react'
import Loader from '../../../Loader'
import TagLabel from '../TagLabel'
import './MiniDashboard.css'
import useInteractionsQuery, {
  InteractionStatistics,
} from '../../../../api/hooks/useInteractionsQuery'

const MiniDashboard = () => {
  const { data, isLoading } = useInteractionsQuery({
    applyFilters: true,
    aggregate: true,
  })

  if (isLoading) {
    return <Loader />
  }

  const stats = data as InteractionStatistics

  return (
    <div className="MiniDashboard">
      <div
        className="MiniDashboard__gauge"
        style={{ '--fill': `${stats?.answeredPercentage}%` } as CSSProperties}
      />
      <p className="MiniDashboard__title">{stats?.answeredPercentage}%</p>
      <p className="MiniDashboard__subtitle">
        Respondidas {stats?.answeredCount}/{stats?.totalCount}
      </p>
      <div className="MiniDashboard__tags_container">
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="SIN RESPUESTA" />
          <span className="MiniDashboard__tag_count">
            {stats?.unansweredCount}
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="YES" />
          <span className="MiniDashboard__tag_count">
            {stats?.confirmedCount}
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="NO" />
          <span className="MiniDashboard__tag_count">
            {stats?.cancelledCount}
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="REAGENDA" />
          <span className="MiniDashboard__tag_count">
            {stats?.rescheduledCount}
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="OTRO" />
          <span className="MiniDashboard__tag_count">{stats?.otherCount}</span>
        </div>
      </div>
    </div>
  )
}

export default MiniDashboard
