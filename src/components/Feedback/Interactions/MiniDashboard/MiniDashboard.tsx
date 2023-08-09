import { CSSProperties } from 'react'
import Loader from '../../../Loader'
import TagLabel from '../TagLabel'
import './MiniDashboard.css'
import useInteractionsQuery, {
  InteractionStatistics,
} from '../../../../api/hooks/useInteractionsQuery'
import CountUp from 'react-countup'

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
      <p className="MiniDashboard__title">
        <CountUp end={stats?.answeredPercentage} />%
      </p>
      <p className="MiniDashboard__subtitle">
        Respondidas <CountUp end={stats?.answeredCount} /> de{' '}
        {stats?.totalCount}
      </p>
      <div className="MiniDashboard__tags_container">
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="SIN RESPUESTA" />
          <span className="MiniDashboard__tag_count">
            <CountUp end={stats?.unansweredCount} />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="YES" />
          <span className="MiniDashboard__tag_count">
            <CountUp end={stats?.confirmedCount} />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="NO" />
          <span className="MiniDashboard__tag_count">
            <CountUp end={stats?.cancelledCount} />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="REAGENDA" />
          <span className="MiniDashboard__tag_count">
            <CountUp end={stats?.rescheduledCount} />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="OTRO" />
          <span className="MiniDashboard__tag_count">
            <CountUp end={stats?.otherCount} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default MiniDashboard
