import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { chat2 as chatAPI } from '../../../../api/endpoints'
import CelularWhatsapp from './CelularWhatsapp/CelularWhatsapp'
import DatosChat from './DatosChat'
import RespuestasChat from './RespuestasChat'
import Error403 from '../../Error403'
import './Chat.css'

const Chat = () => {

  const [conversaciones, setConversaciones] = useState()
  const [indiceConversacion, setIndiceConversacion] = useState()
  const [error403, setError403] = useState(false)
  const { idEncuesta, idUsuario } = useParams()

  const actualizarMensajes = useCallback(() => {
    setConversaciones(undefined)
    chatAPI(idEncuesta, idUsuario)
      .then(({ data }) => {
        const { data: { conversations } } = data
        setConversaciones(conversations)
        setIndiceConversacion(conversations.length - 1)
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
      <DatosChat
        datos={conversaciones && conversaciones[indiceConversacion]?.context}
      />
      <CelularWhatsapp
        conversaciones={conversaciones}
        indiceConversacion={indiceConversacion}
        actualizarMensajes={actualizarMensajes}
      />
      <RespuestasChat
        tags={conversaciones && conversaciones[indiceConversacion]?.tags}
      />
    </div>
  )
}

export default Chat
