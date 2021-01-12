import React from 'react'
import TagRespuesta from '../../TablaRespuestas/TagRespuesta'
import './RespuestasChat.css'
import LoaderChat from '../LoaderChat'

const RespuestasChat = ({ respuesta, headersPreguntas }) => {

  return (
    <div className="RespuestasChat">
      <h2 className="RespuestasChat__titulo">Respuestas</h2>
      {respuesta
        ? headersPreguntas.map(({ name: nombre, display_name: texto }, i) => (
          <div
            key={`header-chat-${i}`}
            className="DatosChat__contenedor_header"
          >
            <div className="DatosChat__nombre_header">
              {texto}
            </div>
            <div className="DatosChat__valor_header">
              {respuesta[nombre] && respuesta[nombre].tag !== undefined
                ? <TagRespuesta tag={respuesta[nombre].tag} />
                : respuesta[nombre]
              }
            </div>
          </div>
        ))
        : <LoaderChat />
      }
    </div>
  )
}

export default RespuestasChat
