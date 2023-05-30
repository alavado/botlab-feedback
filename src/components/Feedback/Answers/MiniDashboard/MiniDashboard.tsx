import { CSSProperties } from 'react'
import TagLabel from '../TagLabel'
import './MiniDashboard.css'

const MiniDashboard = () => {

  const answeredCount = 11
  const total = 20
  const answerPercentage = 100 * answeredCount / total

  return (
    <div className="MiniDashboard">
      <div
        className="MiniDashboard__gauge"
        style={{ '--fill': `${answerPercentage}%` } as CSSProperties}
      />
      <p className="MiniDashboard__title">{answerPercentage}%</p>
      <p className="MiniDashboard__subtitle">Respondidas {answeredCount}/{total}</p>
      <div className="MiniDashboard__tags_container">
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="SIN RESPUESTA" />
          <span className="MiniDashboard__tag_count">100</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="YES" />
          <span className="MiniDashboard__tag_count">100</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="NO" />
          <span className="MiniDashboard__tag_count">100</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="REAGENDA" />
          <span className="MiniDashboard__tag_count">100</span>
        </div>
        <div className="MiniDashboard__tag_count_container">
          <TagLabel tag="OUT" />
          <span className="MiniDashboard__tag_count">100</span>
        </div>
      </div>
    </div>
  )
}

export default MiniDashboard
