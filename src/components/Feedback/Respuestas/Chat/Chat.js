import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { chat as chatAPI } from '../../../../api/endpoints'
import { CelularWhatsapp } from './CelularWhatsapp/CelularWhatsapp'
import DatosChat from './DatosChat'
import RespuestasChat from './RespuestasChat'
import './Chat.css'
import { useSelector } from 'react-redux'

const Chat = () => {

  const [mensajes, setMensajes] = useState()
  const [telefono, setTelefono] = useState()
  const { idEncuesta, idUsuario } = useParams()
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  useEffect(() => {
    chatAPI(idEncuesta, idUsuario)
      .then(({ data }) => {
        const { data: { messages, previous_messages, user: { phone } } } = data
        setMensajes([...previous_messages,  ...messages])
        setTelefono(phone)
        console.log(data)
      })
  }, [idEncuesta, idUsuario])

  if (!idEncuestaSeleccionada) {
    return 'aaa'
  }

  return (
    <div className="Chat">
      {/* <DatosChat telefono={telefono} /> */}
      <CelularWhatsapp mensajes={mensajes} />
      <RespuestasChat telefono={telefono} />
    </div>
  )
}

export default Chat
