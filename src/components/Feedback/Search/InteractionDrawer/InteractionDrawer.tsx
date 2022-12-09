import { MouseEventHandler } from 'react'
import './InteractionDrawer.css'

interface InteractionDrawerProps {
  onCloseClick: MouseEventHandler
}

const InteractionDrawer = ({ onCloseClick }: InteractionDrawerProps) => {
  return (
    <div className="InteractionDrawer">
      <button onClick={onCloseClick}>x</button>
      InteractionDrawer
    </div>
  )
}

export default InteractionDrawer
