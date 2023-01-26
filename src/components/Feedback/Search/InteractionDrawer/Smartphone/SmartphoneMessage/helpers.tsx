import AttachmentMessage from './AttachmentMessage'
import AudioMessage from './AudioMessage'
import PictureMessage from './PictureMessage'
import TextMessage from './TextMessage'
import VCardMessage from './VCardMessage'
import VideoMessage from './VideoMessage'

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

const isVideo = (message: String): Boolean => {
  return message === 'MEDIAVIDEOURL'
}

const isVCard = (message: String): Boolean => {
  return message === 'MEDIAVCARDURL'
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
  if (isVideo(message)) {
    return <VideoMessage answerId={messageId} />
  }
  if (isVCard(message)) {
    return <VCardMessage answerId={messageId} />
  }
  return <TextMessage message={message} />
}
