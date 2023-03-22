import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Icon, InlineIcon } from '@iconify/react'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import './DatosChat.css'
import LoaderChat from '../LoaderChat'
import Scrambler from '../../../../Scrambler'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import useAnalytics from '../../../../../hooks/useAnalytics'

const DatosChat = ({ cargando, datos, telefono }) => {
  const { respuestasVisibles: respuestas, indiceRespuestaSeleccionada } =
    useSelector((state) => state.respuestas)
  const { idEncuestaSeleccionada: idEncuesta } = useSelector(
    (state) => state.encuestas
  )
  // const { tableroVisible } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  const history = useHistory()
  const track = useAnalytics()

  const haySiguienteChat =
    respuestas && indiceRespuestaSeleccionada < respuestas.length - 1
  const hayChatAnterior = indiceRespuestaSeleccionada > 0

  const irARespuestaAnterior = useCallback(() => {
    track('Feedback', 'Chat', 'anterior', { idEncuesta })
    if (!datos || !hayChatAnterior) {
      return
    }
    const respuestaAnterior = respuestas[indiceRespuestaSeleccionada - 1]
    dispatch(
      guardaEstaRespuesta([respuestaAnterior, indiceRespuestaSeleccionada - 1])
    )
    history.push(`/chat/${idEncuesta}/${respuestaAnterior.user_id}`)
  }, [
    datos,
    dispatch,
    history,
    indiceRespuestaSeleccionada,
    idEncuesta,
    respuestas,
    hayChatAnterior,
    track,
  ])

  const irASiguienteRespuesta = useCallback(() => {
    track('Feedback', 'Chat', 'siguiente', { idEncuesta })
    if (!datos || !haySiguienteChat) {
      return
    }
    const siguienteRespuesta = respuestas[indiceRespuestaSeleccionada + 1]
    dispatch(
      guardaEstaRespuesta([siguienteRespuesta, indiceRespuestaSeleccionada + 1])
    )
    history.push(`/chat/${idEncuesta}/${siguienteRespuesta.user_id}`)
  }, [
    datos,
    dispatch,
    history,
    indiceRespuestaSeleccionada,
    idEncuesta,
    respuestas,
    haySiguienteChat,
    track,
  ])

  const datosFixMulticitas = useMemo(() => {
    if (!datos) {
      return undefined
    }
    const nCitas = datos.find((d) => d.title === 'N Citas')?.value
    if (!nCitas) {
      return datos
    }
    return datos.filter(
      (d) =>
        d.target.search(/_[0-9]$/) < 0 ||
        Number(d.target.slice(-1)[0]) <= nCitas
    )
  }, [datos])

  useEffect(() => {
    const teclasMagicas = (e) => {
      if (e.code === 'PageUp' || e.code === 'ArrowLeft') {
        track('Feedback', 'Chat', 'anteriorConTeclado', { idEncuesta })
        irARespuestaAnterior()
      } else if (e.code === 'PageDown' || e.code === 'ArrowRight') {
        track('Feedback', 'Chat', 'siguienteConTeclado', { idEncuesta })
        irASiguienteRespuesta()
      }
    }
    window.addEventListener('keyup', teclasMagicas)
    return () => window.removeEventListener('keyup', teclasMagicas)
  }, [irARespuestaAnterior, irASiguienteRespuesta, track])

  const urlAnterior = history.location.state?.from

  return (
    <div className="DatosChat">
      <div className="DatosChat__navegacion">
        <button
          className="DatosChat__link_atras"
          onClick={() => {
            track(
              'Feedback',
              'Chat',
              `volverA${
                urlAnterior
                  ? urlAnterior[1].toUpperCase() + urlAnterior.slice(2)
                  : 'Respuestas'
              }`
            )
            history.push(urlAnterior ?? '/')
          }}
          title={`Volver a ${
            urlAnterior ? urlAnterior.slice(1) : 'respuestas'
          }`}
        >
          <InlineIcon
            className="DatosChat__icono_volver"
            icon="mdi:arrow-left"
          />
          {urlAnterior
            ? urlAnterior[1].toUpperCase() + urlAnterior.slice(2)
            : 'Respuestas'}
        </button>
        {respuestas &&
          respuestas.length > 0 &&
          indiceRespuestaSeleccionada !== undefined && (
            <div className="DatosChat__botones_navegacion">
              <button
                className="DatosChat__link_anterior"
                onClick={irARespuestaAnterior}
                disabled={cargando || !hayChatAnterior || !datos}
                title={
                  hayChatAnterior
                    ? 'Ver chat anterior (←)'
                    : 'Este es el primer chat de la tabla'
                }
              >
                <InlineIcon
                  className="DatosChat__icono_anterior"
                  icon="mdi:play"
                />
              </button>
              <div className="DatosChat__posicion">
                Chat {(indiceRespuestaSeleccionada + 1).toLocaleString('de-DE')}{' '}
                / {respuestas.length.toLocaleString('de-DE')}
              </div>
              <button
                className="DatosChat__link_siguiente"
                onClick={irASiguienteRespuesta}
                disabled={cargando || !haySiguienteChat || !datos}
                title={
                  haySiguienteChat
                    ? 'Ver chat siguiente (→)'
                    : 'Este es el último chat de la tabla'
                }
              >
                <InlineIcon
                  className="DatosChat__icono_siguiente"
                  icon="mdi:play"
                />
              </button>
            </div>
          )}
      </div>
      <h1 className="DatosChat__titulo">Datos del chat</h1>
      {!cargando && datos !== undefined ? (
        <div className="DatosChat__contenedor_datos">
          <div className="DatosChat__contenedor_header">
            <div className="DatosChat__nombre_header">Teléfono</div>
            <div className="DatosChat__valor_header">
              <Scrambler tipo="telefono">
                {formatearCampoRespuestas(telefono, 'phone')}
              </Scrambler>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://web.whatsapp.com/send/?phone=${telefono}`}
                className="DatosChat__link_ws"
                title="Continuar a chat WhatsApp"
                onClick={() =>
                  track('Feedback', 'Chat', 'abrirWhatsappWebDesdeDatosChat', {
                    link: `https://web.whatsapp.com/send/?phone=${telefono}`,
                  })
                }
              >
                <InlineIcon icon="mdi:whatsapp" />
              </a>
            </div>
            <button
              className="DatosChat__boton_copiar"
              onClick={() => {
                track('Feedback', 'Chat', 'copia', {
                  campo: 'teléfono',
                  valor: telefono,
                })
                navigator.clipboard.writeText(telefono)
              }}
            >
              <Icon icon="mdi:content-copy" /> Copiar
            </button>
          </div>
          {datosFixMulticitas.map(
            ({ value: nombre, title: texto, target }, i) => (
              <div
                key={`header-chat-${i}`}
                className="DatosChat__contenedor_header"
              >
                <div className="DatosChat__nombre_header">{texto}</div>
                <div className="DatosChat__valor_header">
                  <Scrambler propagar={true} tipo={target}>
                    {nombre}
                  </Scrambler>
                </div>
                <button
                  className="DatosChat__boton_copiar"
                  onClick={() => {
                    track('Feedback', 'Chat', 'copia', {
                      campo: texto,
                      valor: nombre,
                    })
                    navigator.clipboard.writeText(nombre)
                  }}
                >
                  <Icon icon="mdi:content-copy" /> Copiar
                </button>
              </div>
            )
          )}
        </div>
      ) : (
        <LoaderChat />
      )}
    </div>
  )
}

export default DatosChat
