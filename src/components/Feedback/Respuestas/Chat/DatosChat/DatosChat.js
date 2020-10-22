import React from 'react'
import { useSelector } from 'react-redux'
import './DatosChat.css'

const DatosChat = ({ telefono }) => {

  const { respuestaSeleccionada } = useSelector(state => state.respuestas)
  const { headers } = useSelector(state => state.encuestas)

  const headersOcultos = []
  const headersVisibles = headers.filter(h => !headersOcultos.includes(h.texto))

  return (
    <div className="DatosChat">
      {headersVisibles.map((header, i) => (
        <div
          key={`header-chat-${i}`}
          className="DatosChat__contenedor_header"
        >
          <div className="DatosChat__nombre_header">
            {header.texto}
          </div>
          <div className="DatosChat__valor_header">
            {respuestaSeleccionada[header.nombre].tag ?? respuestaSeleccionada[header.nombre]}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DatosChat
