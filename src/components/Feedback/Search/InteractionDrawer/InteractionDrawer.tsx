import { Resizable } from 're-resizable'
import { MouseEventHandler } from 'react'
import { useInteractionQuery } from '../../../../api/hooks'
import { Interaction } from '../../../../api/types/servicio'
import './InteractionDrawer.css'

interface InteractionDrawerProps {
  pollId: number
  userId: number
  onCloseClick: MouseEventHandler
}

const InteractionDrawer = ({
  pollId,
  userId,
  onCloseClick,
}: InteractionDrawerProps) => {
  const { data, isLoading, isError } = useInteractionQuery(pollId, userId)

  console.log(data)

  return (
    <Resizable
      defaultSize={{
        width: (2 * window.innerWidth) / 5,
        height: 'auto',
      }}
      maxWidth={(3 * window.innerWidth) / 4}
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
      <div className="InteractionDrawer__top_bar">
        <button onClick={onCloseClick}>x</button>
      </div>
      <div className="InteractionDrawer__phone_container">
        <div className="InteractionDrawer__phone">
          <div className="InteractionDrawer__phone_screen"></div>
        </div>
      </div>
      <div className="InteractionDrawer__comments_container">
        <p>comentarios</p>
        <p>comentarios</p>
        <p>comentarios</p>
        <p>comentarios</p>
        <p>comentarios</p>
        <p>comentarios</p>
        <p>comentarios</p>
        <p>comentarios</p>
      </div>
      <div className="InteractionDrawer__data_container">
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
        <p>datos</p>
      </div>
    </Resizable>
  )
}

export default InteractionDrawer
