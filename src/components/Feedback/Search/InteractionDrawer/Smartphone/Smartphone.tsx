import classNames from 'classnames'
import { format, isSameDay } from 'date-fns'
import es from 'date-fns/esm/locale/es/index.js'
import { useEffect, useMemo, useState } from 'react'
import { Interaction, Message } from '../../../../../api/types/servicio'
import Loader from '../../../../Loader'
import './Smartphone.css'
import SmartphoneActionBar from './SmartphoneActionBar'
import SmartphoneButtons from './SmartphoneButtons'
import SmartphoneMessage from './SmartphoneMessage'
import SmartphoneNavBar from './SmartphoneStatusBar'

export interface SmartphoneChatMessage {
  message: Message
  current: boolean
}

interface SmartphoneChatsDate {
  date: Date
  current: boolean
}

type SmartphoneChatElement = SmartphoneChatMessage | SmartphoneChatsDate

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

  const chatElements: SmartphoneChatElement[] = useMemo(() => {
    if (!currentInteraction || !currentInteraction.messages) {
      return []
    }
    const elements: SmartphoneChatElement[] = []
    const addElement =
      (current: boolean) => (message: Message, i: number, arr: Message[]) => {
        if (i === 0 || !isSameDay(arr[i - 1].timestamp, message.timestamp)) {
          elements.push({ date: message.timestamp, current })
        }
        elements.push({ message, current })
      }
    pastInteractions?.forEach((interaction: Interaction) =>
      interaction.messages?.forEach(addElement(false))
    )
    currentInteraction.messages.forEach(addElement(true))
    futureInteractions?.forEach((interaction: Interaction) =>
      interaction.messages?.forEach(addElement(false))
    )
    return elements
  }, [pastInteractions, currentInteraction, futureInteractions])

  useEffect(() => {
    document
      .querySelector('.Smartphone__date_bubble--current')
      ?.scrollIntoView()
  }, [currentInteraction?.userId])

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
        <SmartphoneButtons
          phoneColor={phoneColor}
          setPhoneColor={setPhoneColor}
        />
        <div className="Smartphone__app_bar">
          <SmartphoneNavBar
            pollId={currentInteraction?.pollId}
            userId={currentInteraction?.userId}
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
                    data={bubble as SmartphoneChatMessage}
                    key={`smartphone-bubble-${i}`}
                  />
                )
              } else {
                return (
                  <div
                    className={classNames({
                      Smartphone__date_bubble: true,
                      'Smartphone__date_bubble--current': bubble.current,
                    })}
                    key={`smartphone-bubble-${i}`}
                  >
                    {format(bubble.date, 'iiii d MMMM yyyy', {
                      locale: es,
                    })}
                  </div>
                )
              }
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
