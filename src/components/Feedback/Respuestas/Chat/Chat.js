import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { chat as chatAPI } from '../../../../api/endpoints'
import { CelularWhatsapp } from './CelularWhatsapp/CelularWhatsapp'
import './Chat.css'
import DatosChat from './DatosChat'

const Chat = () => {

  const [mensajes, setMensajes] = useState([])
  const { idEncuesta, idUsuario } = useParams()

  useEffect(() => {
    chatAPI(idEncuesta, idUsuario)
      .then(({ data }) => {
        const { data: { messages } } = data
        setMensajes(messages)
      })
  }, [idEncuesta, idUsuario])

  return (
    <div className="Chat">
      <DatosChat />
      <CelularWhatsapp
        mensajes={mensajes}
      />
    </div>
  )
}

export default Chat
