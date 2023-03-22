import React, { useMemo } from 'react'
import TagRespuesta from '../../TablaRespuestas/TagRespuesta'
import './RespuestasChat.css'
import LoaderChat from '../LoaderChat'

const textoQuestionsActions = 'action'

const RespuestasChat = ({ datos, tags }) => {
  const tagsInActions = tags?.filter(
    (t) => t.question !== textoQuestionsActions
  )

  const tagsFixMulticitas = useMemo(() => {
    if (!datos || !tagsInActions) {
      return undefined
    }
    const nCitas = datos.find((d) => d.title === 'N Citas')?.value
    if (!nCitas) {
      return tagsInActions
    }
    return tagsInActions.filter(
      (t) =>
        t.question.search(/[0-9]\?$/) < 0 ||
        Number(t.question.slice(-2)[0]) <= nCitas
    )
  }, [datos, tagsInActions])

  return (
    <div className="RespuestasChat">
      <h2 className="RespuestasChat__titulo">Respuestas</h2>
      {tagsFixMulticitas ? (
        tagsFixMulticitas.map(({ question, tag }, i) => (
          <div key={`tag-chat-${i}`} className="DatosChat__contenedor_header">
            <div className="DatosChat__nombre_header">{question}</div>
            <div className="DatosChat__valor_header">
              <TagRespuesta tag={tag} pregunta={question} />
            </div>
          </div>
        ))
      ) : (
        <LoaderChat />
      )}
    </div>
  )
}

export default RespuestasChat
