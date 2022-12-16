import es from 'date-fns/esm/locale/es/index.js'
import { format } from 'date-fns'
import { Resizable } from 're-resizable'
import { MouseEventHandler } from 'react'
import { useInteractionQuery } from '../../../../api/hooks'
import './InteractionDrawer.css'
import Smartphone from './Smartphone'
import { Icon } from '@iconify/react'
import { useHistory } from 'react-router-dom'
import useAnalytics from '../../../../hooks/useAnalytics'

interface InteractionDrawerProps {
  pollId: number
  userId: number
  start: Date
  onPreviousClick: MouseEventHandler
  onNextClick: MouseEventHandler
  onCloseClick: MouseEventHandler
}

const InteractionDrawer = ({
  pollId,
  userId,
  start,
  onPreviousClick,
  onNextClick,
  onCloseClick,
}: InteractionDrawerProps) => {
  const {
    data: interaction,
    isLoading,
    isError,
  } = useInteractionQuery(pollId, userId, start)

  const history = useHistory()
  const track = useAnalytics()

  return (
    <Resizable
      // defaultSize={{
      //   width: window.innerWidth / 5,
      //   height: 'auto',
      // }}
      // maxWidth={(3 * window.innerWidth) / 4}
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
        <div className="InteractionDrawer__top_bar_actions">
          <button
            className="InteractionDrawer__top_bar_action_button"
            onClick={onCloseClick}
          >
            <Icon icon="mdi:chevron-double-right" />
          </button>
          {/* <button onClick={onPreviousClick}>anterior</button>
          <button onClick={onNextClick}>siguiente</button> */}
          <button
            className="InteractionDrawer__legacy_button"
            onClick={() => {
              track('Feedback', 'Search', 'openChatView')
              history.push(
                `/chat/${interaction?.pollId}/${interaction?.userId}`
              )
            }}
          >
            <Icon icon="mdi:cellphone" />
            Ver en pantalla de Chat
          </button>
        </div>
        {/* <h2>
          {interaction
            ? `Interacción: ${format(interaction.start, 'iiii dd/MM', {
                locale: es,
              })}`
            : `Cargando...`}
        </h2> */}
      </div>
      <div className="InteractionDrawer__phone_container">
        <Smartphone interaction={interaction} />
      </div>
      {/* <div className="InteractionDrawer__comments_container">
        <h2>Comentarios</h2>
        <p>No hay comentarios</p>
      </div>
      <div className="InteractionDrawer__data_container">
        <p>Teléfono: {interaction?.phone}</p>
        {interaction?.branch && <p>Sucursal: {interaction?.branch}</p>}
        {interaction?.appointments.map((appointment) => (
          <>
            <p>{appointment.rut}</p>
            <p>{appointment.patientName}</p>
            <p>{format(appointment.datetime, 'HH:mm')}</p>
          </>
        ))}
      </div> */}
    </Resizable>
  )
}

export default InteractionDrawer
