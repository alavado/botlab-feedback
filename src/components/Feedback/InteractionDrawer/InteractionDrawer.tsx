import { Resizable } from 're-resizable'
import { MouseEventHandler } from 'react'
import './InteractionDrawer.css'
import Smartphone from './Smartphone'
import { Icon } from '@iconify/react'
import useChatQuery from '../../../api/hooks/useChatQuery'
import InteractionDrawerActions from './InteractionDrawerActions'
import { InteractionId } from '../../../api/types/domain'
import InteractionComments from './InteractionComments'
import InteractionData from './InteractionData'

interface InteractionDrawerProps {
  interactionId: InteractionId
  onCloseClick: MouseEventHandler
  originComponentName: string
}

const InteractionDrawer = ({
  interactionId,
  onCloseClick,
  originComponentName,
}: InteractionDrawerProps) => {
  const { data } = useChatQuery(interactionId)

  const pastInteractions = data?.pastInteractions
  const currentInteraction = data?.currentInteraction
  const futureInteractions = data?.futureInteractions

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
            title="Cerrar"
          >
            <Icon icon="mdi:chevron-double-right" />
          </button>
          <div className="InteractionDrawer__top_bar_data">
            {/* {currentInteraction ? (
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
            )} */}
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
      <div className="InteractionDrawer__actions_container">
        <InteractionDrawerActions
          interactionId={currentInteraction?.id}
          phone={currentInteraction?.phone}
          schedulingSystemName={
            currentInteraction?.appointments[0].schedulingSystem
          }
          schedulingSystemURL={currentInteraction?.appointments[0].url}
          originComponentName={originComponentName}
        />
        <InteractionComments
          interactionId={currentInteraction?.id}
          originComponentName={originComponentName}
        />
        <InteractionData
          interactionId={currentInteraction?.id}
          originComponentName={originComponentName}
        />
      </div>
    </Resizable>
  )
}

export default InteractionDrawer
