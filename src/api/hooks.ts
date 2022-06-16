import { IconifyIcon } from '@iconify/types'
import axios from 'axios'
import store from '../redux/store'
import { Interaccion, PropiedadServicio, Servicio, Cita, EstadoInteraccion, IDEstadoInteraccion, Pregunta, Conversacion, Mensaje, Comentario } from './types/servicio'
import { parse, format, parseISO, addHours } from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/ducks'
import iconoConfirmacion from '@iconify/icons-mdi/user-circle'
import iconoConfirmacionMulticita from '@iconify/icons-mdi/user-circle'
import { estadosInteracciones } from './estadosInteraccion'
import { chatAPIMessage, chatAPIResponse, reactionsAPIResponse } from './types/responses'

const API_ROOT = process.env.REACT_APP_API_ROOT

const obtenerIconoServicio = (nombre: string): IconifyIcon => {
  switch (nombre) {
    case 'Confirmación':
      return iconoConfirmacion
    case 'Confirmación Multicita':
      return iconoConfirmacionMulticita
    default:
      return iconoConfirmacion
  }
}

const obtenerServicios = async (): Promise<Servicio[]> => {
  const { login, encuestas }: any = store.getState()
  const { token, nombreUsuario } = login
  const url = `${API_ROOT}/polls_headers`
  const headersAPIResponse: any = await axios.get(url, { headers: { 'Api-Token': token } })
  const serviciosQueVienenJuntoAlToken = encuestas.tipos
  const servicios: Servicio[] = headersAPIResponse.data.data.map((headers: any): Servicio => {
    const servicio = serviciosQueVienenJuntoAlToken.find((tipo: { id: any }) => tipo.id === headers.poll_id)
    const nombre = servicio.nombre.replace(nombreUsuario, '').trim()
    return {
      id: servicio.id,
      nombre,
      horaInicio: servicio.integrations[0].start_time,
      habilitado: servicio.enabled,
      icono: obtenerIconoServicio(nombre),
      propiedades: headers.headers.map((header: any): PropiedadServicio => ({
        id: header.name,
        nombre: header.display_name,
        tipo: header.type,
      }))
    }
  })
  servicios.sort((s1, s2) => s1.nombre < s2.nombre ? -1 : 1)
  return servicios
}

export const useServiciosQuery = () => {
  return useQuery(
    'servicios',
    obtenerServicios,
    {
      refetchOnWindowFocus: false
    }
  )
}

const estadoInteraccionPorID = (id: IDEstadoInteraccion): EstadoInteraccion => {
  return estadosInteracciones.find(e => e.id === id) as EstadoInteraccion
}

const obtenerEstadoInteraccionGeneral = (citas: Cita[]): EstadoInteraccion => {
  if (citas.some(cita => cita.estadoInteraccion.id === 'IMPROCESABLE')) {
    return estadoInteraccionPorID('IMPROCESABLE')
  }
  if (citas.some(cita => cita.estadoInteraccion.id === 'REAGENDADA')) {
    return estadoInteraccionPorID('REAGENDADA')
  }
  if (citas.some(cita => cita.estadoInteraccion.id === 'CANCELADA')) {
    return estadoInteraccionPorID('CANCELADA')
  }
  if (citas.some(cita => cita.estadoInteraccion.id === 'CONFIRMADA')) {
    return estadoInteraccionPorID('CONFIRMADA')
  }
  return estadoInteraccionPorID('PENDIENTE')
}

const obtenerEstadoInteraccion = (preguntas: Pregunta[]): EstadoInteraccion => {
  const preguntaConfirmaYESNO = preguntas.find(p => p.tipo === 'YESNO' && p.texto.includes('Confirma'))
  const preguntaReagendaYESNO = preguntas.find(p => p.tipo === 'YESNO' && p.texto.includes('Reagenda'))
  if (preguntaReagendaYESNO) {
    if (preguntaReagendaYESNO.respuesta === 'YES' || preguntaReagendaYESNO.respuesta === 'REAGENDA') {
      return estadoInteraccionPorID('REAGENDADA')
    }
    else if (preguntaReagendaYESNO.respuesta === 'OUT') {
      return estadoInteraccionPorID('IMPROCESABLE')
    }
  }
  if (preguntaConfirmaYESNO) {
    if (preguntaConfirmaYESNO.respuesta === 'NO') {
      return estadoInteraccionPorID('CANCELADA')
    }
    if (preguntaConfirmaYESNO.respuesta === 'YES') {
      return estadoInteraccionPorID('CONFIRMADA')
    }
    if (preguntaConfirmaYESNO.respuesta === 'REAGENDA') {
      return estadoInteraccionPorID('REAGENDADA')
    }
    if (preguntaConfirmaYESNO.respuesta === 'OUT') {
      return estadoInteraccionPorID('IMPROCESABLE')
    }
  }
  return estadoInteraccionPorID('PENDIENTE')
}

const construirInteraccionCitaNormal = (interaccion: any, servicio: Servicio): Interaccion => {
  const preguntas: Pregunta[] = servicio.propiedades
    .filter(p => p.tipo !== 'META')
    .map(p => ({
      id: p.id,
      texto: p.nombre,
      respuesta: interaccion[p.id].tag,
      tipo: p.tipo
    }))
  const estadoInteraccion: EstadoInteraccion = obtenerEstadoInteraccion(preguntas)
  const citas: Cita[] = [{
    id: interaccion.id_cita,
    rut: interaccion.rut,
    nombre: interaccion.name,
    fecha: parse(
      `${interaccion.date} ${interaccion.time}`,
      interaccion.time.includes('M') ? 'd \'de\' MMMM h:m a' : 'd \'de\' MMMM H:m',
      parseISO(interaccion.start),
      { locale: es }
    ),
    responsable: interaccion.dentist_name,
    estadoInteraccion,
    preguntas
  }]
  return {
    sucursal: interaccion.sucursal_name,
    idUsuario: interaccion.user_id,
    inicio: addHours(parseISO(interaccion.start), new Date().getTimezoneOffset() / -60),
    estadoInteraccion,
    citas,
    alertas: [],
    comentarios: interaccion.reactions.map((reaction: any): Comentario => ({
      id: reaction.id,
      timestamp: parseISO(reaction.created_at),
      texto: reaction.reaction_text,
      emoji: reaction.reaction_emoji
    }))
  }
}

const construirInteraccionMulticita = (interaccion: any, servicio: Servicio): Interaccion => {
  const nCitas = Number(interaccion.n_appointments)
  const citas: Cita[] = [...Array(nCitas)].map((_, i): Cita => {
    const indiceCita = i + 1
    const preguntas: Pregunta[] = servicio.propiedades
      .filter(p => p.tipo === 'YESNO' && p.id.endsWith(`${indiceCita}`))
      .map(p => ({
        id: p.id,
        texto: p.nombre,
        respuesta: interaccion[p.id].tag,
        tipo: p.tipo
      }))
    const estadoInteraccion = obtenerEstadoInteraccion(preguntas)
    return {
      id: interaccion[`id_cita_${indiceCita}`],
      rut: interaccion[`rut_${indiceCita}`],
      nombre: interaccion[`patient_name_${indiceCita}`],
      estadoInteraccion,
      preguntas
    }
  })
  return {
    sucursal: interaccion['sucursal_name_1'],
    idUsuario: interaccion['user_id'],
    estadoInteraccion: obtenerEstadoInteraccionGeneral(citas),
    inicio: addHours(parseISO(interaccion['start']), new Date().getTimezoneOffset() / -60),
    citas,
    alertas: [],
    comentarios: interaccion.reactions.map((reaction: any): Comentario => ({
      id: reaction.id,
      timestamp: parseISO(reaction.created_at),
      texto: reaction.reaction_text,
      emoji: reaction.reaction_emoji
    }))
  }
}

const obtenerInteracciones = async (servicio: Servicio, fechaInicio: Date = new Date(), fechaTermino: Date = new Date()): Promise<Interaccion[]> => {
  const { login }: any = store.getState()
  const { token } = login
  const inicio = format(fechaInicio, 'yyyy-MM-dd')
  const termino = format(fechaTermino, 'yyyy-MM-dd')
  const url = `${API_ROOT}/answers/${servicio.id}?fecha_inicio=${inicio}%2000%3A00&fecha_termino=${termino}%2023%3A59`
  const answersAPIResponse: any = await axios.get(url, { headers: { 'Api-Token': token } })
  const interacciones: Interaccion[] = answersAPIResponse.data.data
    .filter((interaccion: any) => interaccion.started === 'True')
    .map((interaccion: any): Interaccion => {
      return interaccion.n_appointments !== undefined
        ? construirInteraccionMulticita(interaccion, servicio)
        : construirInteraccionCitaNormal(interaccion, servicio)
    })
  interacciones.sort((i1, i2) => (i1.citas[0].fecha ?? -1) < (i2.citas[0].fecha ?? 1) ? -1 : 1)
  return interacciones
}

export const useInteraccionesServicioYEstadoActivosQuery = () => {
  const { idServicioActivo, idEstadoInteraccionActivo, fechaInicio, fechaTermino } = useSelector((state: RootState) => state.servicio)
  const queryClient = useQueryClient()
  const servicios = queryClient.getQueryData('servicios') as Servicio[]
  const servicioActivo: Servicio = servicios?.find(s => s.id === idServicioActivo) as Servicio
  return useQuery(
    ['servicio', idServicioActivo],
    () => obtenerInteracciones(servicioActivo, fechaInicio, fechaTermino),
    {
      select: interacciones => {
        interacciones.forEach(interaccion => {
          if (!queryClient.getQueryData(['interaccion', idServicioActivo, interaccion.idUsuario])) {
            queryClient.setQueryData(['interaccion', idServicioActivo, interaccion.idUsuario], interaccion)
          }
        })
        return interacciones.filter(d => idEstadoInteraccionActivo === d.estadoInteraccion.id)
      },
      enabled: !!idServicioActivo && !!idEstadoInteraccionActivo,
      refetchInterval: 30_000
    }
  )
}

export const usePosiblesEstadosInteraccionesQuery = () => {
  const { idServicioActivo } = useSelector((state: RootState) => state.servicio)
  const queryClient = useQueryClient()
  const servicios = queryClient.getQueryData('servicios') as Servicio[]
  const servicioActivo: Servicio = servicios?.find(s => s.id === idServicioActivo) as Servicio
  return useQuery(
    ['servicio', idServicioActivo],
    () => obtenerInteracciones(servicioActivo),
    {
      refetchOnWindowFocus: false,
      enabled: !!idServicioActivo,
      select: data => estadosInteracciones.map(estado => ({
        estado,
        conteo: data.filter(d => d.estadoInteraccion.id === estado.id).length
      }))
    }
  )
}

const obtenerConversaciones = async (idServicio: number, idUsuario: number): Promise<{nombreBot: string, telefonoUsuario: string, conversaciones: Conversacion[]}> => {
  const { login }: any = store.getState()
  const { token } = login
  const url = `${API_ROOT}/chat/${idServicio}/${idUsuario}`
  const response: chatAPIResponse = (await axios.get(url, { headers: { 'Api-Token': token } })).data
  const nombreBot = response.data.bot.name
  const telefonoUsuario = response.data.user.phone
  const conversaciones: Conversacion[] = response.data.conversations.map((c: any): Conversacion => {
    return {
      inicio: parseISO(c.start),
      mensajes: c.messages.map((m: chatAPIMessage): Mensaje => ({
        timestamp: parseISO(m.timestamp),
        mensaje: m.message,
        emisor: m.type === 'bot' ? 'BOT' : 'USUARIO',
        tipo: 'TEXTO'
      }))
    }
  })
  conversaciones.sort((c1, c2) => c1.inicio < c2.inicio ? -1 : 1)
  return {
    nombreBot,
    telefonoUsuario,
    conversaciones
  }
}

export const useInteraccionActivaQuery = () => {
  const { idServicioInteraccionActiva, idUsuarioInteraccionActiva } = useSelector((state: RootState) => state.interaccion)
  const queryClient = useQueryClient()
  return useQuery(
    ['interaccion', idServicioInteraccionActiva, idUsuarioInteraccionActiva],
    async () => {
      const datosExtra = await obtenerConversaciones(idServicioInteraccionActiva as number, idUsuarioInteraccionActiva as number)
      const interaccion = queryClient.getQueryData(['interaccion', idServicioInteraccionActiva, idUsuarioInteraccionActiva]) as Interaccion
      const interaccionCompleta = {
        ...interaccion,
        ...datosExtra
      }
      queryClient.setQueryData(['interaccion', idServicioInteraccionActiva, idUsuarioInteraccionActiva], interaccionCompleta)
      return interaccionCompleta
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!idServicioInteraccionActiva && !!idUsuarioInteraccionActiva
    }
  )
}

const obtenerComentarios = async (idServicio: number, idUsuario: number, inicio: Date): Promise<Comentario[]> => {
  const { login }: any = store.getState()
  const { token } = login
  const url = `${API_ROOT}/reactions/${idServicio}/${idUsuario}`
  const response: reactionsAPIResponse = (await axios.get(url, { headers: { 'Api-Token': token } })).data
  const comentarios: Comentario[] = response.data.map((c: any): Comentario => {
    return {
      id: c.id,
      timestamp: parseISO(c.created_at),
      texto: c.reaction_text,
      emoji: c.reaction_emoji,
    }
  })
  comentarios.sort((c1, c2) => c1.timestamp < c2.timestamp ? -1 : 1)
  return comentarios
}

export const useComentariosInteraccionActivaQuery = () => {
  const { idServicioInteraccionActiva, idUsuarioInteraccionActiva, inicioInteraccionActiva } = useSelector((state: RootState) => state.interaccion)
  const queryClient = useQueryClient()
  return useQuery(
    ['comentarios', idServicioInteraccionActiva, idUsuarioInteraccionActiva, inicioInteraccionActiva],
    async () => {
      const comentarios = await obtenerComentarios(
        idServicioInteraccionActiva as number, 
        idUsuarioInteraccionActiva as number,
        inicioInteraccionActiva as Date
      )
      const interaccion = queryClient.getQueryData(['interaccion', idServicioInteraccionActiva, idUsuarioInteraccionActiva]) as Interaccion
      const interaccionCompleta: Interaccion = {
        ...interaccion,
        comentarios
      }
      queryClient.setQueryData(['interaccion', idServicioInteraccionActiva, idUsuarioInteraccionActiva], interaccionCompleta)
      return interaccionCompleta
    },
    {
      refetchInterval: 60_000,
      refetchOnWindowFocus: false,
      enabled: !!idServicioInteraccionActiva && !!idUsuarioInteraccionActiva && !!inicioInteraccionActiva,
    }
  )
}
