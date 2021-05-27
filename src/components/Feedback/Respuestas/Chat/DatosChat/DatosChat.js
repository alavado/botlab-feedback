import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import iconoVolver from '@iconify/icons-mdi/arrow-left'
import iconoSiguiente from '@iconify/icons-mdi/play'
import iconoAnterior from '@iconify/icons-mdi/play'
import { InlineIcon } from '@iconify/react'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import './DatosChat.css'
import LoaderChat from '../LoaderChat'
import Scrambler from '../../../../../helpers/Scrambler/Scrambler'

const DatosChat = ({ cargando, datos, telefono }) => {

  const { respuestasVisibles: respuestas, indiceRespuestaSeleccionada } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada: idEncuesta } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()
  const history = useHistory()

  const haySiguienteChat = respuestas && indiceRespuestaSeleccionada < respuestas.length - 1
  const hayChatAnterior = indiceRespuestaSeleccionada > 0

  const irARespuestaAnterior = useCallback(() => {
    if (!datos || !hayChatAnterior) {
      return
    }
    const respuestaAnterior = respuestas[indiceRespuestaSeleccionada - 1]
    dispatch(guardaEstaRespuesta([respuestaAnterior, indiceRespuestaSeleccionada - 1]))
    history.push(`/chat/${idEncuesta}/${respuestaAnterior.user_id}`)
  }, [datos, dispatch, history, indiceRespuestaSeleccionada, idEncuesta, respuestas, hayChatAnterior])

  const irASiguienteRespuesta = useCallback(() => {
    if (!datos || !haySiguienteChat) {
      return
    }
    const siguienteRespuesta = respuestas[indiceRespuestaSeleccionada + 1]
    dispatch(guardaEstaRespuesta([siguienteRespuesta, indiceRespuestaSeleccionada + 1]))
    history.push(`/chat/${idEncuesta}/${siguienteRespuesta.user_id}`)
  }, [datos, dispatch, history, indiceRespuestaSeleccionada, idEncuesta, respuestas, haySiguienteChat])

  useEffect(() => {
    const teclasMagicas = e => {
      if (e.code === 'PageUp' || e.code === 'ArrowLeft') {
        irARespuestaAnterior()
      }
      else if (e.code === 'PageDown' || e.code === 'ArrowRight') {
        irASiguienteRespuesta()
      }
    }
    window.addEventListener('keyup', teclasMagicas)
    return () => window.removeEventListener('keyup', teclasMagicas)
  }, [irARespuestaAnterior, irASiguienteRespuesta])

  return (
    <div className="DatosChat">
      <div className="DatosChat__navegacion">
        <button className="DatosChat__link_atras" onClick={() => history.push('/')}>
          <InlineIcon className="DatosChat__icono_volver" icon={iconoVolver} />
          Respuestas
        </button>
        {respuestas && respuestas.length > 0 && indiceRespuestaSeleccionada !== undefined && 
          <div className="DatosChat__botones_navegacion">
            <button
              className="DatosChat__link_anterior"
              onClick={irARespuestaAnterior}
              disabled={cargando || !hayChatAnterior || !datos}
              title={hayChatAnterior ? 'Ver chat anterior (←)' : 'Este es el primer chat de la tabla'}
            >
              <InlineIcon className="DatosChat__icono_anterior" icon={iconoAnterior} />
            </button>
            <div className="DatosChat__posicion">
              Chat {(indiceRespuestaSeleccionada + 1).toLocaleString('de-DE')} / {respuestas.length.toLocaleString('de-DE')}
            </div>
            <button
              className="DatosChat__link_siguiente"
              onClick={irASiguienteRespuesta}
              disabled={cargando || !haySiguienteChat || !datos}
              title={haySiguienteChat ? 'Ver chat siguiente (→)' : 'Este es el último chat de la tabla'}
            >
              <InlineIcon className="DatosChat__icono_siguiente" icon={iconoSiguiente} />
            </button>
          </div>
        }
      </div>
      <h1 className="DatosChat__titulo">Datos del chat</h1>
      {datos && datos[0]
        ? <div className="DatosChat__contenedor_datos">
            <div className="DatosChat__contenedor_header">
              <div className="DatosChat__nombre_header">
                Teléfono
              </div>
              <div className="DatosChat__valor_header">
                <Scrambler tipo="telefono">{telefono}</Scrambler>
              </div>
            </div>
            {datos.map(({ value: nombre, title: texto, target }, i) => (
              <div
                key={`header-chat-${i}`}
                className="DatosChat__contenedor_header"
              >
                <div className="DatosChat__nombre_header">
                  {texto}
                </div>
                <div className="DatosChat__valor_header">
                  <Scrambler propagar={true} tipo={target}>{nombre}</Scrambler>
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
