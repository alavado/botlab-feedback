import { MouseEventHandler } from 'react'
import { Interaction } from '../../../../api/types/servicio'
import './InteractionDrawer.css'

interface InteractionDrawerProps {
  interaction: Interaction
  onCloseClick: MouseEventHandler
}

const InteractionDrawer = ({
  interaction,
  onCloseClick,
}: InteractionDrawerProps) => {
  return (
    <div className="InteractionDrawer">
      <button onClick={onCloseClick}>x</button>
      InteractionDrawer
      {interaction?.userId}
      {interaction?.pollId}
    </div>
  )
}

export default InteractionDrawer
