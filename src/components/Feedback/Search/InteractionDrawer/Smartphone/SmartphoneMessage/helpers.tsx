import AttachmentMessage from './AttachmentMessage'
import AudioMessage from './AudioMessage'
import PictureMessage from './PictureMessage'
import TextMessage from './TextMessage'

export const attachmentsToken = 'ATTACHMENT:'

const hasAttachment = (message: String): Boolean => {
  return message.indexOf(attachmentsToken) >= 0
}

const isPicture = (message: String): Boolean => {
  return message === 'MEDIAIMAGEURL'
}

const isAudio = (message: String): Boolean => {
  return message === 'MEDIAAUDIOURL'
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
  if (isAudio(message)) {
    return <AudioMessage answerId={messageId} />
  }
  return <TextMessage message={message} />
}
