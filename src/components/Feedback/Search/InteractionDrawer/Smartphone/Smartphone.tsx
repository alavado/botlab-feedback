import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { format, isSameDay } from 'date-fns'
import es from 'date-fns/esm/locale/es/index.js'
import Linkify from 'linkify-react'
import { useEffect, useMemo, useState } from 'react'
import uuid from 'react-uuid'
import { Interaction, Message } from '../../../../../api/types/servicio'
import useAnalytics from '../../../../../hooks/useAnalytics'
import Loader from '../../../../Loader'
import AttachmentMessage from './AttachmentMessage'
import { hasAttachment } from './helpers'
import './Smartphone.css'

const formatChatMessage = (message: String) => {
  if (hasAttachment(message)) {
    return <AttachmentMessage message={message} />
  }
  const messageLines = message.split('\n')
  return (
    <>
      {messageLines.map((line: String) => {
        const boldParts = line.split('*')
        return (
          <>
            <>
              {boldParts.map((part, i) => (
                <span
                  key={uuid()}
                  style={{ fontWeight: i % 2 === 0 ? 400 : 'bold' }}
                >
                  <Linkify
                    options={{
                      target: '_blank',
                    }}
                  >
                    {part}
                  </Linkify>
                </span>
              ))}
            </>
            <br />
          </>
        )
      })}
    </>
  )
}

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
  const [time, setTime] = useState(new Date())
  const track = useAnalytics()

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 5_000)
    return () => clearInterval(interval)
  }, [])

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
          <div className="Smartphone__nav_bar">
            <div className="Smartphone__nav_bar_time">
              {format(time, 'H:mm')}
            </div>
            <div className="Smartphone__camera">
              {currentInteraction ? (
                <>
                  {currentInteraction?.pollId} / {currentInteraction?.userId}
                </>
              ) : (
                <>&nbsp;</>
              )}
            </div>
            <div className="Smartphone__nav_bar_icons">
              <Icon icon="mdi:wifi" />
              <Icon icon="mdi:signal" />
              <Icon icon="mdi:battery" />
            </div>
          </div>
          <div className="Smartphone__actions_bar">
            <div
              className="Smartphone__avatar"
              style={
                {
                  '--avatar-hue':
                    360 *
                    (((
                      currentInteraction?.appointments?.[0].patientName.toLowerCase() ??
                      'a'
                    ).charCodeAt(0) -
                      97) /
                      25),
                } as React.CSSProperties
              }
            >
              {currentInteraction?.appointments?.[0].patientName[0] || (
                <Loader color="white" />
              )}
            </div>
            <div className="Smartphone__receiver_name">
              {(
                <>
                  {currentInteraction?.appointments?.[0].patientName}{' '}
                  {currentInteraction &&
                    currentInteraction.appointments.length > 1 && (
                      <span>+{currentInteraction.appointments.length - 1}</span>
                    )}
                </>
              ) || <span>&nbsp;</span>}
              {currentInteraction?.appointments?.[0].patientName && (
                <button
                  className="Smartphone__copy_button"
                  onClick={() => {
                    track('Feedback', 'Smartphone', 'copy', {
                      property: 'patientName',
                      value: currentInteraction?.appointments?.[0].patientName,
                    })
                    navigator.clipboard.writeText(
                      currentInteraction.appointments[0].patientName
                    )
                  }}
                >
                  <Icon icon="mdi:content-copy" /> Copiar
                </button>
              )}
            </div>
            <div className="Smartphone__receiver_status">
              {currentInteraction?.phone && (
                <>
                  <span className="Smartphone__receiver_phone">
                    <Icon icon="mdi:phone" /> {currentInteraction?.phone}
                  </span>
                </>
              )}
              {currentInteraction?.phone && (
                <button
                  className="Smartphone__copy_button"
                  onClick={() => {
                    track('Feedback', 'Smartphone', 'copy', {
                      property: 'phone',
                      value: currentInteraction?.phone,
                    })
                    navigator.clipboard.writeText(
                      currentInteraction.phone as string
                    )
                  }}
                >
                  <Icon icon="mdi:content-copy" /> Copiar
                </button>
              )}
            </div>
            <div className="Smartphone__actions"></div>
          </div>
        </div>
        <div className="Smartphone__messages_container">
          {currentInteraction ? (
            chatBubbles.map((bubble) => {
              if ('content' in bubble.content) {
                return (
                  <div
                    className={classNames({
                      Smartphone__message: true,
                      'Smartphone__message--outbound':
                        bubble.content.sender === 'BOT',
                      'Smartphone__message--focused': bubble.current,
                      'Smartphone__message--unfocused': !bubble.current,
                    })}
                  >
                    <span className="Smartphone__message_content">
                      {formatChatMessage(bubble.content.content)}
                    </span>
                    <span className="Smartphone__message_time">
                      {format(bubble.content.timestamp, 'H:mm')}
                    </span>
                  </div>
                )
              } else {
                return (
                  <div
                    className={classNames({
                      Smartphone__date_bubble: true,
                      'Smartphone__date_bubble--current': bubble.current,
                    })}
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
