import { InlineIcon } from '@iconify/react'
import {  obtenerContenidoMultimedia } from '../../../../../../../api/endpoints'
import './MensajeConAdjunto.css'
import { useState } from 'react'

const MensajeConAdjunto = ({ mensaje }) => {
  
  const [huboError, setHuboError] = useState(false)

  const descargarArchivo = async () => {
    try {
      const data = await obtenerContenidoMultimedia(mensaje.answer_id)
      const elemento = document.createElement('a')
      elemento.setAttribute('target', '_blank')
      elemento.setAttribute('href', data.data.data.url)
      elemento.style.display = 'none'
      document.body.appendChild(elemento)
      elemento.click()
      document.body.removeChild(elemento)
    }
    catch (err) {
      setHuboError(true)
    }
  }

  if (huboError) {
    return <p className="MensajeConAdjunto__error">Archivo no disponible</p>
  }

  return (
    <button
      className="MensajeConAdjunto"
      onClick={descargarArchivo}
    >
      Descargar Archivo
      <InlineIcon className="MensajeConAdjunto__icono_descargar" icon="mdi:download-circle-outline" /> 
    </button>
  )
}

export default MensajeConAdjunto