import classNames from 'classnames'
import { format } from 'date-fns'
import Linkify from 'linkify-react'
import { uniqueId } from 'lodash'
import AttachmentMessage from '../AttachmentMessage'
import { SmartphoneChatMessage } from '../Smartphone'
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

const SmartphoneMessage = ({ data }: { data: SmartphoneChatMessage }) => {
  return (
    <div
      className={classNames({
        SmartphoneMessage: true,
        'SmartphoneMessage--outbound': data.message.sender === 'BOT',
        'SmartphoneMessage--focused': data.current,
        'SmartphoneMessage--unfocused': !data.current,
      })}
    >
      <span className="SmartphoneMessage__content">
        {formatChatMessage(data.message.content)}
      </span>
      <span className="SmartphoneMessage__time">
        {format(data.message.timestamp, 'H:mm')}
      </span>
    </div>
  )
}

export default SmartphoneMessage
