import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import iconoVolver from '@iconify/icons-mdi/arrow-left'
import iconoSiguiente from '@iconify/icons-mdi/play'
import iconoAnterior from '@iconify/icons-mdi/play'
import { InlineIcon } from '@iconify/react'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import './DatosChat.css'
import LoaderChat from '../LoaderChat'

const DatosChat = ({ datos, telefono }) => {

  const { respuestasVisibles: respuestas, indiceRespuestaSeleccionada } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada: idEncuesta } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()
  const history = useHistory()

  const haySiguienteChat = respuestas && indiceRespuestaSeleccionada < respuestas.length - 1
  const hayChatAnterior = indiceRespuestaSeleccionada > 0

  const irARespuestaAnterior = () => {
    const respuestaAnterior = respuestas[indiceRespuestaSeleccionada - 1]
    dispatch(guardaEstaRespuesta([respuestaAnterior, indiceRespuestaSeleccionada - 1]))
    history.push(`/chat/${idEncuesta}/${respuestaAnterior.user_id}`)
  }

  const irASiguienteRespuesta = () => {
    const siguienteRespuesta = respuestas[indiceRespuestaSeleccionada + 1]
    dispatch(guardaEstaRespuesta([siguienteRespuesta, indiceRespuestaSeleccionada + 1]))
    history.push(`/chat/${idEncuesta}/${siguienteRespuesta.user_id}`)
  }

  return (
    <div className="DatosChat">
      <div className="DatosChat__navegacion">
        <button className="DatosChat__link_atras" onClick={() => history.goBack()}>
          <InlineIcon className="DatosChat__icono_volver" icon={iconoVolver} />
          Volver
        </button>
        {indiceRespuestaSeleccionada !== undefined && 
          <div className="DatosChat__botones_navegacion">
            <button
              className="DatosChat__link_anterior"
              onClick={irARespuestaAnterior}
              disabled={!hayChatAnterior || !datos}
              title={hayChatAnterior ? '' : 'Este es el primer chat de esta búsqueda'}
            >
              <InlineIcon className="DatosChat__icono_anterior" icon={iconoAnterior} />
            </button>
            <div className="DatosChat__posicion">{indiceRespuestaSeleccionada + 1} / {respuestas.length}</div>
            <button
              className="DatosChat__link_siguiente"
              onClick={irASiguienteRespuesta}
              disabled={!haySiguienteChat || !datos}
              title={haySiguienteChat ? '' : 'Este es el primer chat de esta búsqueda'}
            >
              <InlineIcon className="DatosChat__icono_siguiente" icon={iconoSiguiente} />
            </button>
          </div>
        }
      </div>
      <h1 className="DatosChat__titulo">Datos del chat</h1>
      {datos
        ? <div className="DatosChat__contenedor_datos">
            <div className="DatosChat__contenedor_header">
              <div className="DatosChat__nombre_header">
                Teléfono
              </div>
              <div className="DatosChat__valor_header">
                {telefono}
              </div>
            </div>
            {datos.map(({ value: nombre, title: texto }, i) => (
              <div
                key={`header-chat-${i}`}
                className="DatosChat__contenedor_header"
              >
                <div className="DatosChat__nombre_header">
                  {texto}
                </div>
                <div className="DatosChat__valor_header">
                  {nombre}
                </div>
              </div>
            ))}
          </div>
        : <LoaderChat />
      }
    </div>
  )
}

export default DatosChat
