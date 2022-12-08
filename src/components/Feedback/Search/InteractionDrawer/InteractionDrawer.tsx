import { MouseEventHandler } from 'react'
import './InteractionDrawer.css'

const InteractionDrawer = ({ onCloseClick }: { onCloseClick: MouseEventHandler }) => {

  return (
    <div className="InteractionDrawer">
      <button onClick={onCloseClick}>
        x
      </button>
      InteractionDrawer
    </div>
  )
}

export default InteractionDrawer