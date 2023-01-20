import { Icon } from '@iconify/react'
import { attachmentsToken } from '../SmartphoneMessage/helpers'
import './AttachmentMessage.css'

const imagesExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp']

const AttachmentMessage = ({ message }: { message: String }) => {
  const attachmentStart =
    message.indexOf(attachmentsToken) + attachmentsToken.length
  const content = message.substring(attachmentStart)
  const attachmentEnd =
    content.search(/\s/) > 0 ? content.search(/\s/) : content.length
  let fileURL = content.substring(0, attachmentEnd)
  if (!fileURL.startsWith('http')) {
    fileURL = `https://${fileURL}`
  }
  const messageWithoutAttachment =
    message.substring(0, message.indexOf(attachmentsToken) - 1) +
    content.substring(attachmentEnd)
  const fileName = decodeURIComponent(
    fileURL.substring(fileURL.lastIndexOf('/') + 1)
  )
  const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)

  return (
    <div>
      {imagesExtensions.includes(fileExtension) ? (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className="AttachmentMessage__file_link"
          href={fileURL}
        >
          <img
            src={fileURL}
            className="AttachmentMessage__image_thumbnail"
            alt="imagen indicación"
          />
        </a>
      ) : (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className="AttachmentMessage__file_link"
          href={fileURL}
        >
          <div className="AttachmentMessage__pdf_icon">PDF</div>
          <div className="AttachmentMessage__file_name">{fileName}</div>
          <div className="AttachmentMessage__link_icon">
            <Icon icon="mdi:arrow-down-bold" />
          </div>
        </a>
      )}
      {messageWithoutAttachment}
    </div>
  )
}

export default AttachmentMessage
