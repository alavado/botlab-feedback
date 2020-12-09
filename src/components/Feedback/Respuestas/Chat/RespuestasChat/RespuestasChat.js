import React from 'react'
import { useSelector } from 'react-redux'
import TagRespuesta from '../../TablaRespuestas/TagRespuesta'
import './RespuestasChat.css'
import LoaderChat from '../LoaderChat'

const RespuestasChat = ({ respuesta }) => {

  const { headers } = useSelector(state => state.encuestas)

  const tiposPreguntas = ['YESNO', 'OPEN', 'RANGE']
  const headersPreguntas = headers?.filter(header => tiposPreguntas.includes(header.tipo))

  return (
    <div className="RespuestasChat">
      <h2 className="RespuestasChat__titulo">Respuestas</h2>
      {respuesta
        ? headersPreguntas.map(({ nombre, texto }, i) => (
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
