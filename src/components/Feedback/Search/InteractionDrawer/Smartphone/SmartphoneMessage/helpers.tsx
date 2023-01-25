import AttachmentMessage from './AttachmentMessage'
import PictureMessage from './PictureMessage'
import TextMessage from './TextMessage'

export const attachmentsToken = 'ATTACHMENT:'

const hasAttachment = (message: String): Boolean => {
  return message.indexOf(attachmentsToken) >= 0
}

const isPicture = (message: String): Boolean => {
  return message.indexOf('MEDIAIMAGEURL') >= 0
}

export const getMessageContentComponent = (
  message: string,
  messageId: number
): React.ReactElement => {
  if (hasAttachment(message)) {
    return <AttachmentMessage message={message} />
  }
  if (isPicture(message)) {
    return <PictureMessage answerId={messageId} />
  }
  return <TextMessage message={message} />
}
