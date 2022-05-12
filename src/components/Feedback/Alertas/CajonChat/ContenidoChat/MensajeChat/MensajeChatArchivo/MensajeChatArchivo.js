import { InlineIcon } from '@iconify/react'
import {  obtenerContenidoMultimedia } from '../../../../../../../api/endpoints'
import iconoArchivo from '@iconify/icons-mdi/download-circle-outline'
import './MensajeChatArchivo.css'
import { useState } from 'react'

const MensajeChatArchivo = ({ mensaje }) => {
  
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
    return <p className="MensajeChatArchivo__error">Archivo no disponible</p>
  }

  return (
    <button
      className="MensajeChatArchivo"
      onClick={descargarArchivo}
    >
      Descargar Archivo
      <InlineIcon className="MensajeChatArchivo__icono_descargar" icon={iconoArchivo} /> 
    </button>
  )
}

export default MensajeChatArchivo