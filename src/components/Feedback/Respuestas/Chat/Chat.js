import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { chat2 as chatAPI } from '../../../../api/endpoints'
import CelularWhatsapp from './CelularWhatsapp/CelularWhatsapp'
import DatosChat from './DatosChat'
import RespuestasChat from './RespuestasChat'
import Error403 from '../../Error403'
import './Chat.css'
import { useSelector } from 'react-redux'
import AccionesChat from './AccionesChat'
import ReaccionesChat from './ReaccionesChat'
import useAnalytics from '../../../../hooks/useAnalytics'
import Draggable from 'react-draggable'
import ReactJson from 'react-json-view'
import useIsLabeler from '../../../../hooks/useIsLabeler'

const msHabilitacionReporteSlack = 0

const Chat = () => {
  const [conversaciones, setConversaciones] = useState()
  const [telefono, setTelefono] = useState()
  const [nombreBot, setNombreBot] = useState()
  const [indiceConversacion, setIndiceConversacion] = useState()
  const [cargando, setCargando] = useState(false)
  const [jsonChat, setJsonChat] = useState({})
  const [error403, setError403] = useState(false)
  const [accionesHabilitadas, setAccionesHabilitadas] = useState()
  const { idEncuesta, idUsuario } = useParams()
  const { cuenta } = useSelector((state) => state.login)
  const { debugging } = useSelector((state) => state.cero)
  const { respuestasVisibles: respuestas, indiceRespuestaSeleccionada } =
    useSelector((state) => state.respuestas)
  const track = useAnalytics()
  const isLabeler = useIsLabeler()

  const actualizarMensajes = useCallback(() => {
    setConversaciones(undefined)
    setCargando(true)
    chatAPI(idEncuesta, idUsuario)
      .then(({ data }) => {
        const {
          data: { conversations, user, bot },
        } = data
        setNombreBot(bot.name)
        setTelefono(user ? user.phone : '')
        setConversaciones(conversations)
        setIndiceConversacion(conversations.length - 1)
        setJsonChat(data)
      })
      .catch(() => setError403(true))
    setCargando(false)
  }, [idEncuesta, idUsuario, indiceRespuestaSeleccionada, respuestas])

  useEffect(() => {
    actualizarMensajes()
  }, [actualizarMensajes])

  useEffect(() => {
    setAccionesHabilitadas(false)
    const to = setTimeout(
      () => setAccionesHabilitadas(true),
      msHabilitacionReporteSlack
    )
    return () => clearTimeout(to)
  }, [indiceRespuestaSeleccionada])

  useEffect(() => track('Feedback', 'Chat', 'index'), [track])

  const link = useMemo(() => {
    if (!conversaciones || conversaciones.length === 0) {
      return null
    }
    const contexto = conversaciones?.[indiceConversacion]?.context
    const tipos = ['Dentalink', 'Medilink']
    for (const tipo of tipos) {
      const link = contexto?.find((meta) => meta.title === tipo)
      if (link) {
        return {
          tipo,
          url: link.value,
        }
      }
    }
  }, [conversaciones, indiceConversacion])

  if (error403) {
    return <Error403 mensaje="No puedes ver este chat." />
  }

  return (
    <div className="Chat">
      {jsonChat?.data && cuenta.endsWith('_cero') && debugging && (
        <>
          <Draggable>
            <div
              className="Chat__contenedor_json Chat__contenedor_json--primero"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="Chat__titulo_contenedor_json">
                appointment_metas
              </h1>
              <div className="Chat__contenedor_scroll_json">
                <ReactJson
                  src={jsonChat.data._appointment_metas}
                  theme="monokai"
                  sortKeys={true}
                  collapsed
                />
              </div>
            </div>
          </Draggable>
          <Draggable>
            <div
              className="Chat__contenedor_json Chat__contenedor_json--segundo"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="Chat__titulo_contenedor_json">appointment_data</h1>
              <div className="Chat__contenedor_scroll_json">
                <ReactJson
                  src={jsonChat.data._appointment_data}
                  theme="monokai"
                  collapsed
                  sortKeys={true}
                />
              </div>
            </div>
          </Draggable>
        </>
      )}
      <DatosChat
        datos={conversaciones?.[indiceConversacion]?.context}
        telefono={telefono}
        cargando={cargando}
      />
      <CelularWhatsapp
        conversaciones={conversaciones}
        indiceConversacion={indiceConversacion}
        actualizarMensajes={actualizarMensajes}
        seleccionarConversacion={setIndiceConversacion}
        nombrePaciente={
          conversaciones?.[indiceConversacion]?.context.find(
            (c) => c.target === 'name' || c.target === 'patient_name_1'
          )?.value
        }
        telefono={telefono ? `+${telefono}` : ''}
      />
      <RespuestasChat
        datos={conversaciones?.[indiceConversacion]?.context}
        tags={conversaciones?.[indiceConversacion]?.tags}
      />
      <div>
        <ReaccionesChat start={conversaciones?.[indiceConversacion]?.start} />
        {accionesHabilitadas && !isLabeler && (
          <AccionesChat telefono={telefono} link={link} />
        )}
      </div>
    </div>
  )
}

export default Chat
