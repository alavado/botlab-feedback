import { Resizable } from 're-resizable'
import { MouseEventHandler } from 'react'
import './InteractionDrawer.css'
import Smartphone from './Smartphone'
import { Icon } from '@iconify/react'
import useChatQuery from '../../../api/hooks/useChatQuery'
import Loader from '../../Loader'
import InteractionDrawerActions from './InteractionDrawerActions'
import { PatientId, ServiceId } from '../../../api/types/types'
import InteractionComments from './InteractionComments'
import useAlertsForPatientQuery from '../../../api/hooks/useAlertsForPatientQuery'

interface InteractionDrawerProps {
  serviceId: ServiceId
  patientId: PatientId
  start: Date
  onCloseClick: MouseEventHandler
  originComponentName: string
}

const InteractionDrawer = ({
  serviceId,
  patientId,
  start,
  onCloseClick,
  originComponentName,
}: InteractionDrawerProps) => {
  const { data } = useChatQuery({
    serviceId,
    patientId,
    start,
  })

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
      <div className="InteractionDrawer__actions_container">
        <InteractionDrawerActions
          serviceId={currentInteraction?.serviceId}
          patientId={currentInteraction?.patientId}
          phone={currentInteraction?.phone}
          schedulingSystemName={
            currentInteraction?.appointments[0].schedulingSystem
          }
          schedulingSystemURL={currentInteraction?.appointments[0].url}
          originComponentName={originComponentName}
        />
        {currentInteraction && (
          <InteractionComments
            serviceId={currentInteraction.serviceId}
            patientId={currentInteraction.patientId}
            interactionStart={currentInteraction.start}
          />
        )}
      </div>
    </Resizable>
  )
}

export default InteractionDrawer
