import axios from 'axios'
import { toBlob } from 'html-to-image'

const obtenerEmoticonTipoReporte = tipo => {
  switch (tipo) {
    case 'Bot se equivoca':
      return `🤖`
    case 'Paciente se molesta':
      return `😡`
  }
  return `👽`
}

export const reportarASlack = async (usuario, cuenta, tipo, descripcion) => {

  const data = {
    'text': `Feedback: Reporte desde ${usuario}`,
    'blocks': [
    	{
    		'type': 'section',
    		'text': {
    			'type': 'mrkdwn',
    			'text': `⚠ Reporte desde *${usuario} (cuenta ${cuenta})*`
    		}
    	},
    	{
    		'type': 'section',
        'fields': [
          {
            'type': 'mrkdwn',
            'text': `*Tipo*\n ${obtenerEmoticonTipoReporte(tipo)} ${tipo}`
          },
          {
            'type': 'mrkdwn',
            'text': `*URL de origen*\n${window.location.href}`
          },
          {
            'type': 'mrkdwn',
            'text': `*Descripción del cliente*\n${descripcion}`
          }
        ]
    	}
    ],
  }
  const fieldsPostData = new FormData()
  fieldsPostData.append('token', process.env.REACT_APP_OAUTH2_TOKEN)
  fieldsPostData.append('channel', process.env.REACT_APP_SLACK_CHANNEL_ID)
  fieldsPostData.append('text', data.text)
  fieldsPostData.append('blocks', JSON.stringify(data.blocks))
  const fieldsData = await axios({
    method: 'post',
    url: 'https://slack.com/api/chat.postMessage',
    data: fieldsPostData
  })
  const fieldsTimestamp = fieldsData.data.message.ts

  const nodoContenedor = document.getElementsByClassName('Feedback__contenedor_central')[0]
  const blobFB = await toBlob(nodoContenedor, { width: nodoContenedor.scrollWidth, height: nodoContenedor.scrollHeight })
  const formData = new FormData()
  formData.append('token', process.env.REACT_APP_OAUTH2_TOKEN)
  formData.append('channels', process.env.REACT_APP_SLACK_CHANNEL_ID)
  formData.append('file', blobFB)
  formData.append('thread_ts', fieldsTimestamp)
  await axios({
    method: 'post',
    url: process.env.REACT_APP_SLACK_FILE_UPLOAD_URL,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  })

  const nodoContenedorMensajes = document.getElementsByClassName('CelularWhatsapp__contenedor_mensajes')[0]
  document.querySelectorAll('.CelularWhatsapp__contenedor_conversacion:not(.CelularWhatsapp__contenedor_conversacion--seleccionada)').forEach(nodo => {
    nodo.style.display = 'none'
  })
  const prevMaxHeight = nodoContenedorMensajes.style.maxHeight
  nodoContenedorMensajes.style.overflow = 'visible'
  nodoContenedorMensajes.style.maxHeight = 'auto'
  const blob = await toBlob(nodoContenedorMensajes, { width: nodoContenedorMensajes.scrollWidth, height: nodoContenedorMensajes.scrollHeight })
  nodoContenedorMensajes.style.overflow = 'auto'
  nodoContenedorMensajes.style.maxHeight = prevMaxHeight
  document.querySelectorAll('.CelularWhatsapp__contenedor_conversacion').forEach(nodo => {
    nodo.style.display = 'block'
  })
  formData.append('file', blob)
  await axios({
    method: 'post',
    url: process.env.REACT_APP_SLACK_FILE_UPLOAD_URL,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  })
}