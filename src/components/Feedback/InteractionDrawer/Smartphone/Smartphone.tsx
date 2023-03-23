import { format, isSameDay, startOfDay } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Comment,
  Interaction,
  Message,
} from '../../../../api/types/types'
import Loader from '../../../Loader'
import SmartphoneActionBar from './SmartphoneActionBar'
import SmartphoneButtons from './SmartphoneButtons'
import SmartphoneMessage from './SmartphoneMessage'
import SmartphoneMessagesDate from './SmartphoneMessagesDate'
import SmartphoneNavBar from './SmartphoneStatusBar'
import './Smartphone.css'
import SmartphoneAlert from './SmartphoneAlert'
import _ from 'lodash'
import SmartphoneComment from './SmartphoneComment'
import useCommentsQuery from '../../../../api/hooks/useCommentsQuery'
import useAlertsForPatientQuery from '../../../../api/hooks/useAlertsForPatientQuery'

export interface SmartphoneChatMessage {
  message: Message
  current: boolean
  date: Date
}

export interface SmartphoneChatsDate {
  date: Date
  current: boolean
}
export interface SmartphoneChatAlert {
  date: Date
  alert: Alert
}
export interface SmartphoneChatComment {
  date: Date
  comment: Comment
}

type SmartphoneChatElement =
  | SmartphoneChatMessage
  | SmartphoneChatsDate
  | SmartphoneChatAlert
  | SmartphoneChatComment

const Smartphone = ({
  pastInteractions,
  currentInteraction,
  futureInteractions,
}: {
  pastInteractions?: Interaction[]
  currentInteraction?: Interaction
  futureInteractions?: Interaction[]
}) => {
  const [phoneColor, setPhoneColor] = useState([0, 0, 10])
  const { data: comments } = useCommentsQuery({
    serviceId: currentInteraction?.serviceId,
    patientId: currentInteraction?.patientId,
    interactionStart: currentInteraction?.start,
  })
  const { data: alerts } = useAlertsForPatientQuery({
    serviceId: currentInteraction?.serviceId,
    patientId: currentInteraction?.patientId,
  })

  const chatElements: SmartphoneChatElement[] = useMemo(() => {
    if (!currentInteraction || !currentInteraction.messages) {
      return []
    }
    const elements: SmartphoneChatElement[] = []
    const addElement =
      (current: boolean = true) =>
      (stuff: Message | Alert | Comment) => {
        if ('content' in stuff) {
          elements.push({ message: stuff, date: stuff.timestamp, current })
        }
        if ('solved' in stuff) {
          elements.push({ alert: stuff, date: stuff.timestamp })
        }
        if ('emoji' in stuff) {
          elements.push({ comment: stuff, date: stuff.timestamp })
        }
      }
    pastInteractions?.forEach((interaction: Interaction) =>
      interaction.messages?.forEach(addElement(false))
    )
    currentInteraction.messages.forEach(addElement(true))
    futureInteractions?.forEach((interaction: Interaction) =>
      interaction.messages?.forEach(addElement(false))
    )
    alerts?.forEach(addElement())
    comments?.forEach(addElement())
    let elementsWithDates: SmartphoneChatElement[] = []
    _.sortBy(elements, 'date').forEach((el, i) => {
      if (i === 0 || !isSameDay(elements[i - 1].date, el.date)) {
        elementsWithDates.push({
          date: startOfDay(el.date),
          current: isSameDay(currentInteraction.start, el.date),
        })
      }
      elementsWithDates.push(el)
    })
    return elementsWithDates
  }, [
    pastInteractions,
    currentInteraction,
    futureInteractions,
    alerts,
    comments,
  ])

  const scrollToCurrentInteraction = () =>
    document.querySelector('.SmartphoneMessagesDate--current')?.scrollIntoView()

  const currentInteractionStart =
    currentInteraction &&
    format(currentInteraction?.start, 'yyyy-MM-dd') + currentInteraction?.phone

  useEffect(() => {
    if (!currentInteractionStart) {
      return
    }
    scrollToCurrentInteraction()
  }, [currentInteractionStart])

  return (
    <div
      className="Smartphone"
      style={
        {
          '--phone-color': `hsl(${phoneColor[0]}, ${phoneColor[1]}%, ${phoneColor[2]}%)`,
        } as React.CSSProperties
      }
    >
      <div className="Smartphone__screen">
        <SmartphoneButtons setPhoneColor={setPhoneColor} />
        <div className="Smartphone__app_bar">
          <SmartphoneNavBar
            serviceId={currentInteraction?.serviceId}
            patientId={currentInteraction?.patientId}
          />
          <SmartphoneActionBar
            contactName={currentInteraction?.appointments?.[0].patientName}
            phone={currentInteraction?.phone}
          />
        </div>
        <div className="Smartphone__messages_container">
          {currentInteraction ? (
            chatElements.map((bubble, i: number) => {
              if ('message' in bubble) {
                return (
                  <SmartphoneMessage
                    data={bubble}
                    key={`smartphone-bubble-${i}`}
                  />
                )
              }
              if ('alert' in bubble) {
                return <SmartphoneAlert alert={bubble.alert} />
              }
              if ('comment' in bubble) {
                return <SmartphoneComment comment={bubble.comment} />
              }
              return (
                <SmartphoneMessagesDate
                  data={bubble as SmartphoneChatsDate}
                  key={`smartphone-bubble-${i}`}
                />
              )
            })
          ) : (
            <div className="Smartphone__loading_message">
              <Loader color="var(--color-principal)" />
              <p>Cargando mensajes...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Smartphone
