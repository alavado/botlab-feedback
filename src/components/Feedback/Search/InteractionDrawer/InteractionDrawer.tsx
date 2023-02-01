import { Resizable } from 're-resizable'
import { MouseEventHandler } from 'react'
import './InteractionDrawer.css'
import Smartphone from './Smartphone'
import { Icon } from '@iconify/react'
import useChatQuery from '../../../../api/hooks/useChatQuery'
import Loader from '../../../Loader'
import InteractionDrawerActions from './InteractionDrawerActions'

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
  const alerts = data?.alerts

  return (
    <Resizable
      className="InteractionDrawer"
      enable={{
        left: true,
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
          alerts={alerts}
        />
      </div>
      <div className="InteractionDrawer__actions_container">
        <InteractionDrawerActions
          pollId={currentInteraction?.serviceId}
          userId={currentInteraction?.patientId}
          phone={currentInteraction?.phone}
          schedulingSystemName={
            currentInteraction?.appointments[0].schedulingSystem
          }
          schedulingSystemURL={currentInteraction?.appointments[0].url}
          originComponentName={originComponentName}
        />
      </div>
    </Resizable>
  )
}

export default InteractionDrawer
