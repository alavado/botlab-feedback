import { Resizable } from 're-resizable'
import { MouseEventHandler } from 'react'
import { usePollInteractionsForUserQuery } from '../../../../api/hooks'
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
  } = usePollInteractionsForUserQuery(pollId, userId, start)

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
      maxWidth="90vw"
    >
      <div className="InteractionDrawer__top_bar">
        <div className="InteractionDrawer__top_bar_actions">
          <button
            className="InteractionDrawer__top_bar_action_button"
            onClick={onCloseClick}
          >
            <Icon icon="mdi:chevron-double-right" />
          </button>
          <div className="InteractionDrawer__top_bar_data">
            <span>
              <Icon icon="mdi:user" />{' '}
              {interaction?.appointments[0]?.patientName}{' '}
            </span>{' '}
            •
            <span>
              <Icon icon="mdi:phone" /> {interaction?.phone}
            </span>
          </div>
          {/* <button onClick={onPreviousClick}>anterior</button>
          <button onClick={onNextClick}>siguiente</button> */}
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
      <div className="InteractionDrawer__legacy_buttons_container">
        <button
          className="InteractionDrawer__legacy_button"
          onClick={() => {
            track('Feedback', 'Search', 'openChatView')
            history.push(`/chat/${interaction?.pollId}/${interaction?.userId}`)
          }}
        >
          <Icon icon="mdi:cellphone" />
          Ver en <br /> vista Chat
        </button>
        <button
          className="InteractionDrawer__legacy_button"
          onClick={() => {
            track('Feedback', 'Search', 'openWhatsapp')
            const el = document.createElement('a')
            el.setAttribute('target', '_blank')
            el.setAttribute('href', `https://wa.me/${interaction?.phone}`)
            el.style.display = 'none'
            document.body.appendChild(el)
            el.click()
            document.body.removeChild(el)
          }}
        >
          <Icon icon="mdi:whatsapp" />
          Chatear con <br /> paciente
        </button>
        {interaction?.appointments[0]?.url && (
          <button
            className="InteractionDrawer__legacy_button"
            onClick={() => {
              track('Feedback', 'Search', 'openDentalink')
              const el = document.createElement('a')
              el.setAttribute('target', '_blank')
              el.setAttribute('href', interaction.appointments[0].url as string)
              el.style.display = 'none'
              document.body.appendChild(el)
              el.click()
              document.body.removeChild(el)
            }}
          >
            <Icon icon="mdi:tooth-outline" />
            Ver en <br />
            Dentalink
          </button>
        )}
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
