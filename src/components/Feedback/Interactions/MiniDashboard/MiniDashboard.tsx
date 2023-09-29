import { CSSProperties } from 'react'
import useInteractionsStatisticsQuery from '../../../../api/hooks/useInteractionsStatisticsQuery'
import Loader from '../../../Loader'
import TagLabel from '../TagLabel'
import './MiniDashboard.css'

const MiniDashboard = () => {

  const { data, isLoading } = useInteractionsStatisticsQuery()

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="MiniDashboard">
      <div
        className="MiniDashboard__gauge"
        style={{ '--fill': `${data?.answeredPercentage}%` } as CSSProperties}
      />
      <p className="MiniDashboard__title">{data?.answeredPercentage}%</p>
      <p className="MiniDashboard__subtitle">
        Respondidas {data?.answeredCount}/{data?.totalCount}
      </p>
      <div className="MiniDashboard__tags_container">
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="SIN RESPUESTA" />
          <span className="MiniDashboard__tag_count">{data?.unansweredCount}</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="YES" />
          <span className="MiniDashboard__tag_count">{data?.confirmedCount}</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="NO" />
          <span className="MiniDashboard__tag_count">{data?.cancelledCount}</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="REAGENDA" />
          <span className="MiniDashboard__tag_count">{data?.rescheduledCount}</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="OTRO" />
          <span className="MiniDashboard__tag_count">{data?.otherCount}</span>
        </div>
      </div>
    </div>
  )
}

export default MiniDashboard
