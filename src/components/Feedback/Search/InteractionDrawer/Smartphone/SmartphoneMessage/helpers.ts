export const attachmentsToken = 'ATTACHMENT:'

export const hasAttachment = (message: String): Boolean => {
  return message.indexOf(attachmentsToken) >= 0
}
