import React from 'react'
import TagRespuesta from '../../TablaRespuestas/TagRespuesta'
import './RespuestasChat.css'
import LoaderChat from '../LoaderChat'

const textoQuestionsActions = 'action'

const RespuestasChat = ({ tags }) => {

  const tagsInActions = tags?.filter(t => t.question !== textoQuestionsActions)

  return (
    <div className="RespuestasChat">
      <h2 className="RespuestasChat__titulo">Respuestas</h2>
      {tagsInActions
        ? tagsInActions.map(({ question, tag }, i) => (
          <div
            key={`tag-chat-${i}`}
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
