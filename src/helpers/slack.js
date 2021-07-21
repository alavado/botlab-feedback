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
    'text': `Feedback: Reporte desde cuenta ${usuario}`,
    'blocks': [
    	{
    		'type': 'section',
    		'text': {
    			'type': 'mrkdwn',
    			'text': `⚠ Reporte desde cuenta *${usuario} (cuenta ${cuenta})*`
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
  await axios.post(
    process.env.REACT_APP_SLACK_WEBHOOK_URL,
    JSON.stringify(data),
    {
      withCredentials: false,
      transformRequest: [(data, headers) => {
        delete headers.post["Content-Type"]
        return data
      }]
    }
  )

  const nodoContenedor = document.getElementsByClassName('Feedback__contenedor_central')[0]
  const blobFB = await toBlob(nodoContenedor, { width: nodoContenedor.scrollWidth, height: nodoContenedor.scrollHeight })
  const formData = new FormData()
  formData.append('token', process.env.REACT_APP_OAUTH2_TOKEN)
  formData.append('channels', process.env.REACT_APP_SLACK_CHANNEL_ID)
  formData.append('file', blobFB)
  const ssData = await axios({
    method: 'post',
    url: process.env.REACT_APP_SLACK_FILE_UPLOAD_URL,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  })
  const ssTimestamp = ssData.data.file.shares.private[process.env.REACT_APP_SLACK_CHANNEL_ID][0].ts

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
  formData.append('thread_ts', ssTimestamp)
  await axios({
    method: 'post',
    url: process.env.REACT_APP_SLACK_FILE_UPLOAD_URL,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  })
}