import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { chat as chatAPI } from '../../../../api/endpoints'
import './Chat.css'

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
      {mensajes.map(mensaje => (
        <div className="Chat__mensaje" key={mensaje.epoch}>
          <p>{mensaje.type}</p>
          <p>{mensaje.timestamp}</p>
          <p>{mensaje.message}</p>
        </div>
      ))}
    </div>
  )
}

export default Chat
