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
        <CountUp
          separator="."
          decimal=","
          end={stats?.answeredPercentage}
          preserveValue={true}
          decimals={1}
          duration={0.35}
          suffix="%"
        />
      </p>
      <p className="MiniDashboard__subtitle">
        Respondidas{' '}
        <CountUp
          separator="."
          decimal=","
          end={stats?.answeredCount}
          preserveValue={true}
          duration={0.35}
        />{' '}
        de {stats?.totalCount}
      </p>
      <div className="MiniDashboard__tags_container">
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="SIN RESPUESTA" />
          <span className="MiniDashboard__tag_count">
            <CountUp
              separator="."
              decimal=","
              end={stats?.unansweredCount}
              preserveValue={true}
              duration={0.35}
            />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="YES" />
          <span className="MiniDashboard__tag_count">
            <CountUp
              separator="."
              decimal=","
              end={stats?.confirmedCount}
              preserveValue={true}
              duration={0.35}
            />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="NO" />
          <span className="MiniDashboard__tag_count">
            <CountUp
              separator="."
              decimal=","
              end={stats?.cancelledCount}
              preserveValue={true}
              duration={0.35}
            />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="REAGENDA" />
          <span className="MiniDashboard__tag_count">
            <CountUp
              separator="."
              decimal=","
              end={stats?.rescheduledCount}
              preserveValue={true}
              duration={0.35}
            />
          </span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="OTRO" />
          <span className="MiniDashboard__tag_count">
            <CountUp
              separator="."
              decimal=","
              end={stats?.otherCount}
              preserveValue={true}
              duration={0.35}
            />
          </span>
        </div>
      </div>
    </div>
  )
}

export default MiniDashboard
