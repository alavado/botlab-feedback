import classNames from 'classnames'
import { format } from 'date-fns'
import Linkify from 'linkify-react'
import { uniqueId } from 'lodash'
import AttachmentMessage from '../AttachmentMessage'
import { hasAttachment } from './helpers'
import './SmartphoneMessage.css'

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
                  key={uniqueId()}
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

const SmartphoneMessage = ({ bubble }: { bubble: any }) => {
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
}

export default SmartphoneMessage