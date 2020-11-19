import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { chat as chatAPI } from '../../../../api/endpoints'
import { CelularWhatsapp } from './CelularWhatsapp/CelularWhatsapp'
import DatosChat from './DatosChat'
import RespuestasChat from './RespuestasChat'
import './Chat.css'
import { useSelector } from 'react-redux'
import Error403 from '../../Error403'

const Chat = () => {

  const [mensajes, setMensajes] = useState()
  const [respuesta, setRespuesta] = useState()
  const [error403, setError403] = useState(false)
  const { idEncuesta, idUsuario } = useParams()
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  useEffect(() => {
    chatAPI(idEncuesta, idUsuario)
      .then(({ data }) => {
        const { data: { messages, previous_messages, user } } = data
        setMensajes([...previous_messages,  ...messages])
        setRespuesta(user)
      })
      .catch(({ message }) => setError403(message.indexOf('403') >= 0))
  }, [idEncuesta, idUsuario])

  if (error403) {
    return <Error403 mensaje="No puedes ver este chat." />
  }
  else if (!idEncuestaSeleccionada || !respuesta) {
    return 'aaa'
  }

  return (
    <div className="Chat">
      <DatosChat respuesta={respuesta} />
      <CelularWhatsapp mensajes={mensajes} />
      <RespuestasChat respuesta={respuesta} />
    </div>
  )
}

export default Chat
