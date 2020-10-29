import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { chat as chatAPI } from '../../../../api/endpoints'
import { CelularWhatsapp } from './CelularWhatsapp/CelularWhatsapp'
import './Chat.css'
import DatosChat from './DatosChat'

const Chat = () => {

  const [mensajes, setMensajes] = useState()
  const [telefono, setTelefono] = useState()
  const { idEncuesta, idUsuario } = useParams()

  useEffect(() => {
    chatAPI(idEncuesta, idUsuario)
      .then(({ data }) => {
        const { data: { messages, previous_messages, user: { phone } } } = data
        setMensajes([...previous_messages,  ...messages])
        setTelefono(phone)
      })
  }, [idEncuesta, idUsuario])

  return (
    <div className="Chat">
      <DatosChat />
      <CelularWhatsapp
        mensajes={mensajes}
      />
      <div style={{flex: 1}}>
        <div className="DatosChat__contenedor_header">
          <div className="DatosChat__nombre_header">
            Teléfono
          </div>
          <div className="DatosChat__valor_header">
            {telefono}
          </div>
        </div>
        <a
          href={`https://wa.me/${telefono}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Hablar con usuario
        </a>
      </div>
    </div>
  )
}

export default Chat
