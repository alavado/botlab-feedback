import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'
import { SmartphoneChatMessage } from '../Smartphone'
import { getMessageContentComponent } from './helpers'
import './SmartphoneMessage.css'

const SmartphoneMessage = ({ data }: { data: SmartphoneChatMessage }) => {
  const messageTime = format(data.message.timestamp, 'H:mm')
  const messageContent = getMessageContentComponent(
    data.message.content,
    data.message.id
  )

  const { debugging } = useSelector((state: RootState) => state.cero)

  return (
    <div
      className={classNames({
        SmartphoneMessage: true,
        'SmartphoneMessage--outbound': data.message.sender === 'BOT',
        'SmartphoneMessage--focused': data.current,
        Smartphone__element_not_current: !data.current,
      })}
    >
      <span className="SmartphoneMessage__content">{messageContent}</span>
      <span className="SmartphoneMessage__time">{messageTime}</span>
      {debugging && data.message.sender === 'USER' && (
        <span className="SmartphoneMessage__tag">
          <Icon icon="mdi:robot" /> {data.message.tag}
        </span>
      )}
    </div>
  )
}

export default SmartphoneMessage
