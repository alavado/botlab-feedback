import { Resizable } from 're-resizable'
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
    <Resizable
      defaultSize={{
        width: '33rem',
        height: 'auto',
      }}
      maxWidth={(2 * window.innerWidth) / 3}
      className="InteractionDrawer"
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <button onClick={onCloseClick}>x</button>
      InteractionDrawer
      {interaction?.userId}
      {interaction?.pollId}
    </Resizable>
  )
}

export default InteractionDrawer
