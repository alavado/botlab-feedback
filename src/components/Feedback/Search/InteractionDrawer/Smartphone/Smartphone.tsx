import classNames from 'classnames'
import { format, isSameDay } from 'date-fns'
import es from 'date-fns/esm/locale/es/index.js'
import { useEffect, useMemo, useState } from 'react'
import { Interaction, Message } from '../../../../../api/types/servicio'
import useAnalytics from '../../../../../hooks/useAnalytics'
import Loader from '../../../../Loader'
import './Smartphone.css'
import SmartphoneActionBar from './SmartphoneActionBar'
import SmartphoneMessage from './SmartphoneMessage'
import SmartphoneNavBar from './SmartphoneStatusBar'

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
  const track = useAnalytics()

  const setRandomPhoneColor = () =>
    setPhoneColor([
      360 * Math.random(),
      25 + 75 * Math.random(),
      75 * Math.random(),
    ])

  const chatBubbles: { content: Message | Date; current: boolean }[] =
    useMemo(() => {
      if (!currentInteraction || !currentInteraction.messages) {
        return []
      }
      const bubbles: { content: Message | Date; current: boolean }[] = []
      pastInteractions?.forEach((interaction: Interaction) => {
        interaction.messages?.forEach((message: Message, i, arr) => {
          if (i === 0 || !isSameDay(arr[i - 1].timestamp, message.timestamp)) {
            bubbles.push({ content: message.timestamp, current: false })
          }
          bubbles.push({ content: message, current: false })
        })
      })
      currentInteraction.messages.forEach((message: Message, i, arr) => {
        if (i === 0 || !isSameDay(arr[i - 1].timestamp, message.timestamp)) {
          bubbles.push({ content: message.timestamp, current: true })
        }
        bubbles.push({ content: message, current: true })
      })
      futureInteractions?.forEach((interaction: Interaction) => {
        interaction.messages?.forEach((message: Message, i, arr) => {
          if (i === 0 || !isSameDay(arr[i - 1].timestamp, message.timestamp)) {
            bubbles.push({ content: message.timestamp, current: false })
          }
          bubbles.push({ content: message, current: false })
        })
      })
      return bubbles
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
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l1"
          onClick={() => {
            track('Feedback', 'Smartphone', 'colorRandomizer')
            setRandomPhoneColor()
          }}
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l2"
          onClick={() => {
            track('Feedback', 'Smartphone', 'colorLightningUp')
            setPhoneColor((c) => [c[0], c[1], Math.min(75, c[2] + 5)])
          }}
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l3"
          onClick={() => {
            track('Feedback', 'Smartphone', 'colorLightningDown')
            setPhoneColor((c) => [c[0], c[1], Math.min(75, c[2] - 5)])
          }}
        />
        <button
          className="Smartphone__button Smartphone__button-r Smartphone__button-r1"
          onClick={() => {
            track('Feedback', 'Smartphone', 'colorReset')
            setPhoneColor([0, 0, 10])
          }}
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
            chatBubbles.map((bubble, i: number) => {
              if ('content' in bubble.content) {
                return (
                  <SmartphoneMessage
                    bubble={bubble}
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
                    {format(bubble.content, 'iiii d MMMM yyyy', {
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
