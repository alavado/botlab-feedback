import AttachmentMessage from './AttachmentMessage'
import TextMessage from './TextMessage'

export const attachmentsToken = 'ATTACHMENT:'

const hasAttachment = (message: String): Boolean => {
  return message.indexOf(attachmentsToken) >= 0
}

export const getMessageContentComponent = (
  message: string
): React.ReactElement => {
  if (hasAttachment(message)) {
    return <AttachmentMessage message={message} />
  }
  return <TextMessage message={message} />
}
