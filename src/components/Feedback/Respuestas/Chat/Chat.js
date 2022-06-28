import React, { useState, useEffect, useCallback, useMemo } from 'react'
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

const msExpiracionCache = 60_000
const msHabilitacionReporteSlack = 0

const Chat = () => {

  const [conversaciones, setConversaciones] = useState()
  const [telefono, setTelefono] = useState()
  const [nombreBot, setNombreBot] = useState()
  const [indiceConversacion, setIndiceConversacion] = useState()
  const [chatsCacheados, setChatCacheados] = useState({})
  const [cargando, setCargando] = useState(false)
  const [error403, setError403] = useState(false)
  const [accionesHabilitadas, setAccionesHabilitadas] = useState()
  const { idEncuesta, idUsuario } = useParams()
  const { respuestasVisibles: respuestas, indiceRespuestaSeleccionada } = useSelector(state => state.respuestas)
  const track = useAnalytics()

  const actualizarMensajes = useCallback(() => {
    setConversaciones(undefined)
    setCargando(true)
    const chatCacheado = chatsCacheados[idUsuario]
    if (chatCacheado && Date.now() - chatCacheado.t < msExpiracionCache) {
      setTelefono(chatCacheado.telefono)
      setConversaciones(chatCacheado.conversaciones)
      setIndiceConversacion(chatCacheado.conversaciones.length - 1)
    }
    else {
      chatAPI(idEncuesta, idUsuario)
        .then(({ data }) => {
          const { data: { conversations, user, bot } } = data
          setNombreBot(bot.name)
          setTelefono(user ? user.phone : '')
          setConversaciones(conversations)
          setIndiceConversacion(conversations.length - 1)
          setChatCacheados({
            ...chatsCacheados,
            [idUsuario]: {
              telefono: user ? user.phone : '',
              conversaciones: conversations,
              t: Date.now()
            }
          })
        })
        .catch(() => setError403(true))
    }
    const haySiguienteChat = respuestas && indiceRespuestaSeleccionada < respuestas.length - 1
    if (haySiguienteChat && !chatsCacheados[respuestas[indiceRespuestaSeleccionada + 1].user_id]) {
      chatAPI(idEncuesta, respuestas[indiceRespuestaSeleccionada + 1].user_id)
        .then(({ data }) => {
          const { data: { conversations, user } } = data
          setChatCacheados({
            ...chatsCacheados,
            [respuestas[indiceRespuestaSeleccionada + 1].user_id]: {
              telefono: user ? user.phone : '',
              conversaciones: conversations,
              t: Date.now()
            }
          })
          setCargando(false)
        })
    }
    else {
      setCargando(false)
    }
  }, [idEncuesta, idUsuario, indiceRespuestaSeleccionada, respuestas])

  useEffect(() => {
    actualizarMensajes()
  }, [actualizarMensajes])

  useEffect(() => {
    setAccionesHabilitadas(false)
    const to = setTimeout(() => setAccionesHabilitadas(true), msHabilitacionReporteSlack)
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
      const link = contexto?.find(meta => meta.title === tipo)
      if (link) {
        return {
          tipo,
          url: link.value
        }
      }
    }
  }, [conversaciones, indiceConversacion])

  if (error403) {
    return <Error403 mensaje="No puedes ver este chat." />
  }

  return (
    <div className="Chat">
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
        nombreBot={nombreBot}
      />
      <RespuestasChat
        tags={conversaciones?.[indiceConversacion]?.tags}
      />
      <div>
        <ReaccionesChat start={conversaciones?.[indiceConversacion]?.start} />
        {accionesHabilitadas && 
          <AccionesChat
            telefono={telefono}
            link={link}
          />
        }
      </div>
    </div>
  )
}

export default Chat
