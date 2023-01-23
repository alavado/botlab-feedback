import { Resizable } from 're-resizable'
import { MouseEventHandler } from 'react'
import './InteractionDrawer.css'
import Smartphone from './Smartphone'
import { Icon } from '@iconify/react'
import { useHistory } from 'react-router-dom'
import useAnalytics from '../../../../hooks/useAnalytics'
import useChatQuery from '../../../../api/hooks/useChatQuery'
import Loader from '../../../Loader'
import { openExternalLink } from './helpers'

interface InteractionDrawerProps {
  pollId: number
  userId: number
  start: Date
  onCloseClick: MouseEventHandler
  originComponentName: string
}

const InteractionDrawer = ({
  pollId,
  userId,
  start,
  onCloseClick,
  originComponentName,
}: InteractionDrawerProps) => {
  const { data } = useChatQuery({
    pollId,
    userId,
    start,
  })

  const pastInteractions = data?.pastInteractions
  const currentInteraction = data?.currentInteraction
  const futureInteractions = data?.futureInteractions

  const history = useHistory()
  const track = useAnalytics()

  return (
    <Resizable
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
            {currentInteraction ? (
              <>
                <span>
                  <Icon icon="mdi:user" />{' '}
                  {currentInteraction?.appointments[0]?.patientName}{' '}
                </span>{' '}
                •
                <span>
                  <Icon icon="mdi:phone" /> {currentInteraction?.phone}
                </span>
              </>
            ) : (
              <Loader color="var(--color-texto)" />
            )}
          </div>
        </div>
      </div>
      <div className="InteractionDrawer__phone_container">
        <Smartphone
          pastInteractions={pastInteractions}
          currentInteraction={currentInteraction}
          futureInteractions={futureInteractions}
        />
      </div>
      <div className="InteractionDrawer__legacy_buttons_container">
        <button
          className="InteractionDrawer__legacy_button"
          onClick={() => {
            track('Feedback', originComponentName, 'openChatView')
            history.push(
              `/chat/${currentInteraction?.pollId}/${currentInteraction?.userId}`,
              { from: '/busqueda' }
            )
          }}
        >
          <Icon icon="mdi:cellphone" />
          Ver en <br /> vista Chat
        </button>
        <button
          className="InteractionDrawer__legacy_button"
          onClick={() => {
            track('Feedback', originComponentName, 'openWhatsapp')
            openExternalLink(
              `https://web.whatsapp.com/send/?phone=${currentInteraction?.phone}`
            )
          }}
        >
          <Icon icon="mdi:whatsapp" />
          Contactar
          <br />
          por Whatsapp
        </button>
        {currentInteraction?.appointments[0]?.url && (
          <button
            className="InteractionDrawer__legacy_button"
            onClick={() => {
              track('Feedback', originComponentName, 'openSchedulingSystem')
              openExternalLink(currentInteraction.appointments[0].url as string)
            }}
          >
            <Icon icon="mdi:arrow-top-right" />
            Ver cita en <br />
            {currentInteraction?.appointments[0]?.schedulingSystem}
          </button>
        )}
      </div>
    </Resizable>
  )
}

export default InteractionDrawer
