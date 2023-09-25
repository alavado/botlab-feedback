import { Icon } from '@iconify/react'
import { useHistory } from 'react-router-dom'
import { InteractionId } from '../../../../api/types/domain'
import useAnalytics from '../../../../hooks/useAnalytics'
import useIsLabeler from '../../../../hooks/useIsLabeler'
import { openExternalLink } from '../helpers'
import logo from '../../../../assets/images/logo_blanco.png'
import './InteractionDrawerActions.css'
import ReportIssueDialog from './IssueSubmissionDialog/IssueSubmissionDialog'
import { useState } from 'react'
import useWhatsappLink from '../../../../hooks/useWhatsappLink'

interface InteractionDrawerActionsProps {
  interactionId?: InteractionId
  phone?: string
  schedulingSystemName?: string
  schedulingSystemURL?: string
  originComponentName: string
}

const InteractionDrawerActions = ({
  interactionId,
  phone,
  schedulingSystemName,
  schedulingSystemURL,
  originComponentName,
}: InteractionDrawerActionsProps) => {
  const history = useHistory()
  const track = useAnalytics()
  const isLabeler = useIsLabeler()
  const [issueDialogVisible, setIssueDialogVisible] = useState(false)
  const whatsappLink = useWhatsappLink(phone)

  const openChatView = () => {
    history.push(
      `/chat/${interactionId?.serviceId}/${interactionId?.patientId}`,
      {
        from: originComponentName === 'Search' ? '/busqueda' : '/alertas',
      }
    )
  }

  const openWhatsapp = () => openExternalLink(whatsappLink)

  const openSchedulingSystem = () => {
    if (!schedulingSystemURL) {
      return
    }
    openExternalLink(schedulingSystemURL)
  }

  return (
    <div className="InteractionDrawerActions">
      <ReportIssueDialog
        visible={issueDialogVisible}
        onClose={() => setIssueDialogVisible(false)}
        originComponentName={originComponentName}
      />
      <button
        className="InteractionDrawerActions__button"
        onClick={() => {
          openChatView()
          track('Feedback', originComponentName, 'openChatView')
        }}
      >
        <Icon icon="mdi:cellphone" />
        Ver en vista Chat
      </button>
      {!isLabeler && (
        <>
          <button
            className="InteractionDrawerActions__button"
            onClick={() => {
              track('Feedback', originComponentName, 'openWhatsapp')
              openWhatsapp()
            }}
          >
            <Icon icon="mdi:whatsapp" />
            Contactar por Whatsapp
          </button>
        </>
      )}
      {schedulingSystemURL && !isLabeler && (
        <button
          className="InteractionDrawerActions__button"
          onClick={() => {
            track('Feedback', originComponentName, 'openSchedulingSystem')
            openSchedulingSystem()
          }}
        >
          <Icon icon="mdi:arrow-top-right" />
          Ver cita en {schedulingSystemName}
        </button>
      )}
      {!isLabeler && (
        <>
          <button
            className="InteractionDrawerActions__button"
            onClick={() => {
              track('Feedback', originComponentName, 'openReportIssueDialog')
              setIssueDialogVisible(true)
            }}
          >
            <Icon icon="mdi:alert" />
            Reportar problema a{' '}
            <img
              className="InteractionDrawerActions__cero"
              src={logo}
              alt="CERO"
            />
          </button>
        </>
      )}
    </div>
  )
}

export default InteractionDrawerActions
