import React from 'react'
import TagRespuesta from '../../TablaRespuestas/TagRespuesta'
import './RespuestasChat.css'
import LoaderChat from '../LoaderChat'

const RespuestasChat = ({ tags }) => {

  return (
    <div className="RespuestasChat">
      <h2 className="RespuestasChat__titulo">Respuestas</h2>
      {tags
        ? tags.map(({ question, tag }, i) => (
          <div
            key={`header-chat-${i}`}
            className="DatosChat__contenedor_header"
          >
            <div className="DatosChat__nombre_header">
              {question}
            </div>
            <div className="DatosChat__valor_header">
              <TagRespuesta tag={tag} pregunta={question} />
            </div>
          </div>
        ))
        : <LoaderChat />
      }
    </div>
  )
}

export default RespuestasChat
