import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Icon, InlineIcon } from '@iconify/react'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import './DatosChat.css'
import LoaderChat from '../LoaderChat'
import Scrambler from '../../../../Scrambler'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import { muestraModal } from '../../../../../redux/ducks/configuracion'
import useAnalytics from '../../../../../hooks/useAnalytics'

const DatosChat = ({ cargando, datos, telefono }) => {

  const { respuestasVisibles: respuestas, indiceRespuestaSeleccionada } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada: idEncuesta } = useSelector(state => state.encuestas)
  // const { tableroVisible } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  const history = useHistory()
  const track = useAnalytics()

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

  const mostrarModalConfiguracion = () => {
    track('Feedback-Chat-abrirConfiguracion')
    dispatch(muestraModal())
  }

  const urlAnterior = history.location.state?.from

  return (
    <div className="DatosChat">
      <div className="DatosChat__navegacion">
        <button
          className="DatosChat__link_atras"
          onClick={() => history.push(urlAnterior ?? '/')}
          title="Volver a respuestas"
        >
          <InlineIcon className="DatosChat__icono_volver" icon="mdi:arrow-left" />
          {urlAnterior ? 'Alertas': 'Respuestas'}
        </button>
        {respuestas && respuestas.length > 0 && indiceRespuestaSeleccionada !== undefined && 
          <div className="DatosChat__botones_navegacion">
            <button
              className="DatosChat__link_anterior"
              onClick={irARespuestaAnterior}
              disabled={cargando || !hayChatAnterior || !datos}
              title={hayChatAnterior ? 'Ver chat anterior (←)' : 'Este es el primer chat de la tabla'}
            >
              <InlineIcon className="DatosChat__icono_anterior" icon="mdi:play" />
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
              <InlineIcon className="DatosChat__icono_siguiente" icon="mdi:play" />
            </button>
          </div>
        }
      </div>
      <h1 className="DatosChat__titulo">
        Datos del chat
        <button
          className="TablaRespuestas__boton_configuracion"
          tooltip="Configuración"
          onClick={mostrarModalConfiguracion}
        >
          <Icon
            className="TablaRespuestas__boton_icono"
            icon="mdi:cog"
          />
        </button>
      </h1>
      {!cargando && datos !== undefined
        ? <div className="DatosChat__contenedor_datos">
            <div className="DatosChat__contenedor_header">
              <div className="DatosChat__nombre_header">
                Teléfono
              </div>
              <div className="DatosChat__valor_header">
                <Scrambler tipo="telefono">{formatearCampoRespuestas(telefono, 'phone')}</Scrambler>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://wa.me/${telefono}`}
                  className="DatosChat__link_ws"
                  title="Continuar a chat WhatsApp"
                >
                  <InlineIcon icon="mdi:whatsapp" />
                </a>
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
