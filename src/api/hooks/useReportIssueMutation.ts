import { useMutation, UseMutationResult } from 'react-query'
import { toBlob } from 'html-to-image'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import useActiveServiceQuery from './useActiveServiceQuery'

export type IssueType = 'STUPID_BOT' | 'ANGRY_PATIENT' | 'OTHER'

const useReportIssueMutation = (): UseMutationResult<unknown, unknown> => {
  const { nombreUsuario, cuenta } = useSelector(
    (state: RootState) => state.login
  )
  const { data: activeService } = useActiveServiceQuery()
  const nombreEncuestaSeleccionada = activeService?.name
  return useMutation<any, any, any>({
    mutationKey: 'issue',
    mutationFn: async ({
      description,
    }: {
      issueType: IssueType
      description: string
    }) => {
      const result = await reportToSlackChannel({
        token: process.env.REACT_APP_OAUTH2_TOKEN as string,
        channelID: cuenta?.endsWith('cero')
          ? (process.env.REACT_APP_SLACK_INTERNAL_CHANNEL_ID as string)
          : (process.env.REACT_APP_SLACK_CHANNEL_ID as string),
        messageText: `Feedback: Reporte desde *${nombreUsuario}*`,
        contentTitle: `Reporte desde *${nombreUsuario}*`,
        contentFields: [
          {
            label: 'Tipo',
            value: 'Bot se equivoca',
          },
          {
            label: 'Cuenta',
            value: cuenta || '??',
          },
          {
            label: 'Servicio',
            value: nombreEncuestaSeleccionada || '??',
          },
          {
            label: 'URL',
            value: window.location.href,
          },
          {
            label: 'Descripción',
            value: description,
          },
        ],
      })
      await axios({
        method: 'post',
        url: 'https://eoyqyij8fcu0p4y.m.pipedream.net',
        data: {
          client: nombreUsuario,
          service: nombreEncuestaSeleccionada,
          description,
          feedback_username: cuenta,
          feedback_url: window.location.href,
        },
      })
      return result
    },
  })
}

const reportToSlackChannel = async ({
  token,
  channelID,
  messageText,
  contentTitle,
  contentFields,
}: {
  token: string
  channelID: string
  messageText: string
  contentTitle: string
  contentFields: { label: string; value: string }[]
}) => {
  const messagesContainerClass = 'Smartphone__messages_container'
  const previousDisplayStyles = Array.from(
    document.querySelectorAll<HTMLElement>('.Smartphone__element_not_current')
  ).map((node) => node.style.display)
  document
    .querySelectorAll<HTMLElement>('.Smartphone__element_not_current')
    .forEach((node) => {
      node.style.display = 'none'
    })

  const mainContainerElement = document.getElementsByClassName(
    'InteractionDrawer'
  )[0] as HTMLElement
  const blobFB = await toBlob(mainContainerElement, {
    width: mainContainerElement.scrollWidth,
    height: mainContainerElement.scrollHeight,
  })

  const messagesContainerElement = document.getElementsByClassName(
    messagesContainerClass
  )[0] as HTMLElement
  const prevMaxHeight = messagesContainerElement.style.maxHeight
  messagesContainerElement.style.overflow = 'visible'
  messagesContainerElement.style.maxHeight = 'auto'
  const blob = await toBlob(messagesContainerElement, {
    width: messagesContainerElement.scrollWidth,
    height: messagesContainerElement.scrollHeight,
  })
  messagesContainerElement.style.overflow = 'auto'
  messagesContainerElement.style.maxHeight = prevMaxHeight
  document
    .querySelectorAll<HTMLElement>('.Smartphone__element_not_current')
    .forEach((node, i) => {
      node.style.display = previousDisplayStyles[i]
    })

  const fieldsPostData = new FormData()
  fieldsPostData.append('token', token)
  fieldsPostData.append('channel', channelID)
  fieldsPostData.append('text', messageText)
  fieldsPostData.append('unfurl_links', 'false')
  fieldsPostData.append(
    'blocks',
    JSON.stringify([
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: contentTitle,
        },
      },
      {
        type: 'section',
        fields: contentFields.map((t) => ({
          type: 'mrkdwn',
          text: `*${t.label}*\n${t.value}`,
        })),
      },
    ])
  )
  const fieldsData = await axios({
    method: 'post',
    url: 'https://slack.com/api/chat.postMessage',
    data: fieldsPostData,
  })
  const fieldsTimestamp = fieldsData.data.message.ts
  const formData = new FormData()
  formData.append('token', token)
  formData.append('channels', channelID)
  formData.append('file', blobFB as Blob)
  formData.append('thread_ts', fieldsTimestamp)
  await axios({
    method: 'post',
    url: process.env.REACT_APP_SLACK_FILE_UPLOAD_URL,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  formData.append('file', blob as Blob)
  await axios({
    method: 'post',
    url: process.env.REACT_APP_SLACK_FILE_UPLOAD_URL,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return fieldsTimestamp
}

export default useReportIssueMutation
