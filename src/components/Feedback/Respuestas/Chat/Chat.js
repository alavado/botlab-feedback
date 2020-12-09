import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { chat as chatAPI } from '../../../../api/endpoints'
import CelularWhatsapp from './CelularWhatsapp/CelularWhatsapp'
import DatosChat from './DatosChat'
import RespuestasChat from './RespuestasChat'
import Error403 from '../../Error403'
import './Chat.css'

const Chat = () => {

  const [mensajes, setMensajes] = useState()
  const [respuesta, setRespuesta] = useState()
  const [error403, setError403] = useState(false)
  const { idEncuesta, idUsuario } = useParams()

  const actualizarMensajes = useCallback((fetchInicial = true) => {
    if (fetchInicial) {
      setRespuesta(undefined)
    }
    setMensajes(undefined)
    chatAPI(idEncuesta, idUsuario)
      .then(({ data }) => {
        const { data: { messages, previous_messages, user } } = data
        setMensajes({
          anteriores: [...previous_messages],
          actuales: [...messages]
        })
        setRespuesta(user)
      })
      .catch(() => setError403(true))
  }, [idEncuesta, idUsuario])

  useEffect(() => {
    actualizarMensajes()
  }, [actualizarMensajes])

  if (error403) {
    return <Error403 mensaje="No puedes ver este chat." />
  }

  return (
    <div className="Chat">
      <DatosChat respuesta={respuesta} />
      <CelularWhatsapp mensajes={mensajes} actualizarMensajes={actualizarMensajes} />
      <RespuestasChat respuesta={respuesta} />
    </div>
  )
}

export default Chat
