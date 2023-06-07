import { Icon } from '@iconify/react'
import { useHistory } from 'react-router-dom'
import { ServiceId } from '../../../../api/types/domain'
import useAnalytics from '../../../../hooks/useAnalytics'
import useIsLabeler from '../../../../hooks/useIsLabeler'
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
  const isLabeler = useIsLabeler()

  const openChatView = () => {
    track('Feedback', originComponentName, 'openChatView')
    history.push(`/chat/${serviceId}/${patientId}`, {
      from: originComponentName === 'Search' ? '/busqueda' : '/alertas',
    })
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
    <div className="InteractionDrawerActions">
      <button
        className="InteractionDrawerActions__button"
        onClick={openChatView}
      >
        <Icon icon="mdi:cellphone" />
        Ver en vista Chat
      </button>
      {!isLabeler && (
        <button
          className="InteractionDrawerActions__button"
          onClick={openWhatsapp}
        >
          <Icon icon="mdi:whatsapp" />
          Contactar por Whatsapp
        </button>
      )}
      {schedulingSystemURL && !isLabeler && (
        <button
          className="InteractionDrawerActions__button"
          onClick={openSchedulingSystem}
        >
          <Icon icon="mdi:arrow-top-right" />
          Ver cita en {schedulingSystemName}
        </button>
      )}
    </div>
  )
}

export default InteractionDrawerActions
