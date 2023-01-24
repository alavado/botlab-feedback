import classNames from 'classnames'
import { format } from 'date-fns'
import { SmartphoneChatMessage } from '../Smartphone'
import { getMessageContentComponent } from './helpers'
import './SmartphoneMessage.css'

const SmartphoneMessage = ({ data }: { data: SmartphoneChatMessage }) => {
  const messageTime = format(data.message.timestamp, 'H:mm')
  const messageContent = getMessageContentComponent(data.message.content)

  return (
    <div
      className={classNames({
        SmartphoneMessage: true,
        'SmartphoneMessage--outbound': data.message.sender === 'BOT',
        'SmartphoneMessage--focused': data.current,
        'SmartphoneMessage--unfocused': !data.current,
      })}
    >
      <span className="SmartphoneMessage__content">{messageContent}</span>
      <span className="SmartphoneMessage__time">{messageTime}</span>
    </div>
  )
}

export default SmartphoneMessage
