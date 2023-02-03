import { Icon } from '@iconify/react'
import { useHistory } from 'react-router-dom'
import { ServiceId } from '../../../../../api/types/servicio'
import useAnalytics from '../../../../../hooks/useAnalytics'
import { openExternalLink } from '../helpers'
import './InteractionDrawerActions.css'

interface InteractionDrawerActionsProps {
  serviceId?: ServiceId
  patientId?: number
  phone?: string
  schedulingSystemName?: string
  schedulingSystemURL?: string
  originComponentName: string
}

const InteractionDrawerActions = ({
  serviceId,
  patientId,
  phone,
  schedulingSystemName,
  schedulingSystemURL,
  originComponentName,
}: InteractionDrawerActionsProps) => {
  const history = useHistory()
  const track = useAnalytics()

  const openChatView = () => {
    track('Feedback', originComponentName, 'openChatView')
    history.push(`/chat/${serviceId}/${patientId}`, { from: '/busqueda' })
  }

  const openWhatsapp = () => {
    track('Feedback', originComponentName, 'openWhatsapp')
    openExternalLink(`https://web.whatsapp.com/send/?phone=${phone}`)
  }

  const openSchedulingSystem = () => {
    if (!schedulingSystemURL) {
      return
    }
    track('Feedback', originComponentName, 'openSchedulingSystem')
    openExternalLink(schedulingSystemURL)
  }

  return (
    <>
      <button
        className="InteractionDrawerActions__button"
        onClick={openChatView}
      >
        <Icon icon="mdi:cellphone" />
        Ver en vista Chat
      </button>
      <button
        className="InteractionDrawerActions__button"
        onClick={openWhatsapp}
      >
        <Icon icon="mdi:whatsapp" />
        Contactar por Whatsapp
      </button>
      {schedulingSystemURL && (
        <button
          className="InteractionDrawerActions__button"
          onClick={openSchedulingSystem}
        >
          <Icon icon="mdi:arrow-top-right" />
          Ver cita en {schedulingSystemName}
        </button>
      )}
    </>
  )
}

export default InteractionDrawerActions
