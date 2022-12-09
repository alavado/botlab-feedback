import { MouseEventHandler } from 'react'
import './InteractionDrawer.css'

interface InteractionDrawerParams {
  onCloseClick: MouseEventHandler
}

const InteractionDrawer = ({ onCloseClick }: InteractionDrawerParams) => {
  return (
    <div className="InteractionDrawer">
      <button onClick={onCloseClick}>x</button>
      InteractionDrawer
    </div>
  )
}

export default InteractionDrawer
