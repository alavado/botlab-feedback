import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import TagRespuesta from '../../TablaRespuestas/TagRespuesta'
import iconoVolver from '@iconify/icons-mdi/arrow-left'
import iconoSiguiente from '@iconify/icons-mdi/play'
import iconoAnterior from '@iconify/icons-mdi/play'
import { InlineIcon } from '@iconify/react'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import './DatosChat.css'

const DatosChat = ({ telefono }) => {

  const { respuestasVisibles: respuestas, respuestaSeleccionada: respuesta, indiceRespuestaSeleccionada } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()
  const history = useHistory()

  if (!headers) {
    return null
  }

  const haySiguienteChat = indiceRespuestaSeleccionada < respuestas.length - 1
  const hayChatAnterior = indiceRespuestaSeleccionada > 0
  const headersSinPreguntas = headers.filter(header => header.tipo !== 'YESNO')

  const irARespuestaAnterior = () => {
    const respuestaAnterior = respuestas[indiceRespuestaSeleccionada - 1]
    dispatch(guardaEstaRespuesta(respuestaAnterior, indiceRespuestaSeleccionada - 1))
    history.push(`/chat/${idEncuesta}/${respuestaAnterior.user_id}`)
  }

  const irASiguienteRespuesta = () => {
    const siguienteRespuesta = respuestas[indiceRespuestaSeleccionada + 1]
    dispatch(guardaEstaRespuesta(siguienteRespuesta, indiceRespuestaSeleccionada + 1))
    history.push(`/chat/${idEncuesta}/${siguienteRespuesta.user_id}`)
  }
  
  return (
    <div className="DatosChat">
      <div className="DatosChat__navegacion">
        <Link className="DatosChat__link_atras" to="/respuestas">
          <InlineIcon className="DatosChat__icono_volver" icon={iconoVolver} />
          Volver
        </Link>
        <div className="DatosChat__botones_navegacion">
          <button
            className="DatosChat__link_anterior"
            onClick={irARespuestaAnterior}
            disabled={!hayChatAnterior}
            title={!hayChatAnterior && 'Este es el primer chat de esta búsqueda'}
          >
            <InlineIcon className="DatosChat__icono_anterior" icon={iconoAnterior} />
          </button>
          <div className="DatosChat__posicion">{indiceRespuestaSeleccionada + 1} / {respuestas.length}</div>
          <button
            className="DatosChat__link_siguiente"
            onClick={irASiguienteRespuesta}
            disabled={!haySiguienteChat}
            title={!haySiguienteChat && 'No hay más chats en esta búsqueda'}
          >
            <InlineIcon className="DatosChat__icono_siguiente" icon={iconoSiguiente} />
          </button>
        </div>
      </div>
      <h1 className="DatosChat__titulo">Datos del chat</h1>
      <div className="DatosChat__contenedor_datos">
        <div className="DatosChat__contenedor_header">
          <div className="DatosChat__nombre_header">
            Teléfono
          </div>
          <div className="DatosChat__valor_header">
            {telefono}
          </div>
        </div>
        {headersSinPreguntas.map(({ nombre, texto }, i) => (
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
        ))}
      </div>
    </div>
  )
}

export default DatosChat
