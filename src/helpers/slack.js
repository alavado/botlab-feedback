import axios from 'axios'
import { toBlob } from 'html-to-image'

const obtenerEmoticonTipoReporte = tipo => {
  switch (tipo) {
    case 'Bot se equivoca':
      return `🤖`
    case 'Paciente molesto':
      return `😡`
  }
  return `❓`
}

export const reportarASlack = async (cuenta, tipo, descripcion) => {

  const data = {
    "text": `Feedback: Reporte desde cuenta ${cuenta}`,
    "blocks": [
    	{
    		"type": "section",
    		"text": {
    			"type": "mrkdwn",
    			"text": `Reporte desde cuenta *${cuenta}*`
    		}
    	},
    	{
    		"type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*Tipo*\n ${obtenerEmoticonTipoReporte(tipo)} ${tipo}`
          },
          {
            "type": "mrkdwn",
            "text": `*URL de origen*\n${window.location.href}`
          },
          {
            "type": "mrkdwn",
            "text": `*Descripción*\n${descripcion}`
          }
        ]
    	}
    ],
  }
  axios.post(
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
  
  const formData = new FormData()
  formData.append('token', process.env.REACT_APP_OAUTH2_TOKEN)
  formData.append('channels', process.env.REACT_APP_SLACK_CHANNEL_ID)
  const nodoContenedorMensajes = document.getElementsByClassName('CelularWhatsapp__contenedor_mensajes')[0]
  document.querySelectorAll('.CelularWhatsapp__contenedor_conversacion:not(.CelularWhatsapp__contenedor_conversacion--seleccionada)').forEach(nodo => {
    nodo.style.display = 'none'
  })
  const prevMaxHeight = nodoContenedorMensajes.style.maxHeight
  nodoContenedorMensajes.style.overflow = 'visible'
  nodoContenedorMensajes.style.maxHeight = 'auto'
  const blob = await toBlob(nodoContenedorMensajes, { width: nodoContenedorMensajes.scrollWidth, height: nodoContenedorMensajes.scrollHeight })
  formData.append('file', blob)
  nodoContenedorMensajes.style.overflow = 'hidden'
  nodoContenedorMensajes.style.maxHeight = prevMaxHeight
  document.querySelectorAll('.CelularWhatsapp__contenedor_conversacion:not(.CelularWhatsapp__contenedor_conversacion--seleccionada)').forEach(nodo => {
    nodo.style.display = 'flex'
  })
  await axios({
    method: 'post',
    url: process.env.REACT_APP_SLACK_FILE_UPLOAD_URL,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" }
  })
}