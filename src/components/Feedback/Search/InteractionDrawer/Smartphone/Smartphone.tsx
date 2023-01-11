import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { format, isSameDay } from 'date-fns'
import es from 'date-fns/esm/locale/es/index.js'
import Linkify from 'linkify-react'
import { useEffect, useMemo, useState } from 'react'
import uuid from 'react-uuid'
import { Interaction, Message } from '../../../../../api/types/servicio'
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

const Smartphone = ({ interaction }: { interaction?: Interaction }) => {
  const [phoneColor, setPhoneColor] = useState([0, 0, 10])
  const [time, setTime] = useState(new Date())

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

  const chatBubbles: (Message | Date)[] = useMemo(() => {
    if (!interaction || !interaction.messages) {
      return []
    }
    const bubbles: (Message | Date)[] = []
    interaction.messages.forEach((message: Message, i, arr) => {
      if (i === 0 || !isSameDay(arr[i - 1].timestamp, message.timestamp)) {
        bubbles.push(message.timestamp)
      }
      bubbles.push(message)
    })
    return bubbles
  }, [interaction])

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
          onClick={setRandomPhoneColor}
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l2"
          onClick={() =>
            setPhoneColor((c) => [c[0], c[1], Math.min(75, c[2] + 5)])
          }
        />
        <button
          className="Smartphone__button Smartphone__button-l Smartphone__button-l3"
          onClick={() =>
            setPhoneColor((c) => [c[0], c[1], Math.min(75, c[2] - 5)])
          }
        />
        <button
          className="Smartphone__button Smartphone__button-r Smartphone__button-r1"
          onClick={() => setPhoneColor([0, 0, 10])}
        />
        <div className="Smartphone__app_bar">
          <div className="Smartphone__nav_bar">
            <div className="Smartphone__nav_bar_time">
              {format(time, 'H:mm')}
            </div>
            <div className="Smartphone__camera">
              {interaction?.pollId} / {interaction?.userId}
            </div>
            <div className="Smartphone__nav_bar_icons">
              <Icon icon="mdi:wifi" />
              <Icon icon="mdi:signal" />
              <Icon icon="mdi:battery" />
            </div>
          </div>
          <div className="Smartphone__actions_bar">
            <div className="Smartphone__avatar">
              {interaction?.botName?.[0]}
            </div>
            <div className="Smartphone__receiver_name">
              {interaction?.botName || '...'}
            </div>
            <div className="Smartphone__receiver_status">en línea</div>
            <div className="Smartphone__actions"></div>
          </div>
        </div>
        <div className="Smartphone__messages_container">
          {interaction ? (
            chatBubbles.map((bubble) => {
              if ('content' in bubble) {
                return (
                  <div
                    className={classNames({
                      Smartphone__message: true,
                      'Smartphone__message--outbound': bubble.sender === 'USER',
                    })}
                  >
                    <span className="Smartphone__message_content">
                      {formatChatMessage(bubble.content)}
                    </span>
                    <span className="Smartphone__message_time">
                      {format(bubble.timestamp, 'H:mm')}
                    </span>
                  </div>
                )
              } else {
                return (
                  <div className="Smartphone__date_bubble">
                    {format(bubble, 'd MMMM yyyy', { locale: es })}
                  </div>
                )
              }
            })
          ) : (
            <Loader color="var(--color-principal)" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Smartphone
