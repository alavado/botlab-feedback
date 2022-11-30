import axios from 'axios'
import store from '../redux/store'
import { Interaccion, PropiedadServicio, Servicio, Cita, EstadoInteraccion, IDEstadoInteraccion, Pregunta, Conversacion, Mensaje, Comentario, Alerta } from './types/servicio'
import { parse, format, parseISO, addHours, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/ducks'
import { estadosInteracciones } from './estadosInteraccion'
import { alertasAPIResponse, chatAPIMessage, chatAPIResponse, reactionsAPIResponse } from './types/responses'

const API_ROOT = process.env.REACT_APP_API_ROOT

const get = async (url: string) => {
  const { login }: any = store.getState()
  const { token } = login
  return axios.get(url, { headers: { 'Api-Token': token } } )
}

const obtenerIconoServicio = (nombre: string): string => {
  switch (nombre) {
    case 'Confirmación':
      return 'mdi:account-check'
    case 'Confirmación Multicita':
      return 'mdi:account-multiple-check'
    case 'Recaptura':
      return 'mdi:account-convert'
    case 'Control N Meses':
      return 'mdi:account-arrow-right'
    default:
      return 'mdi:account-check'
  }
}

const obtenerDescripcionServicio = (nombre: string): string => {
  switch (nombre) {
    case 'Confirmación':
      return 'Confirmación de una cita con un contacto'
    case 'Confirmación Multicita':
      return 'Confirmación de varias citas con el mismo contacto'
    case 'Recaptura':
      return 'Recaptura de pacientes que no se presentan a su cita'
    case 'Control N Meses':
      return 'Sugerencia de hora para control meses después de la última cita'
    default:
      return 'Servicio activo'
  }
}

const obtenerServicios = async (): Promise<Servicio[]> => {
  const { login, encuestas }: any = store.getState()
  const { nombreUsuario } = login
  const headersAPIResponse: any = get(`${API_ROOT}/polls_headers`)
  const serviciosQueVienenJuntoAlToken = encuestas.tipos
  const servicios: Servicio[] = headersAPIResponse.data.data.map((headers: any): Servicio => {
    const servicio = serviciosQueVienenJuntoAlToken.find((tipo: { id: any }) => tipo.id === headers.poll_id)
    const nombre = servicio.nombre.replace(nombreUsuario, '').trim()
    return {
      id: servicio.id,
      nombre,
      horaInicio: servicio.integrations[0]?.start_time || '0:00',
      habilitado: servicio.enabled,
      icono: obtenerIconoServicio(nombre),
      propiedades: headers.headers.map((header: any): PropiedadServicio => ({
        id: header.name,
        nombre: header.display_name,
        tipo: header.type,
      })),
      sucursales: servicio.sucursales,
      descripcion: obtenerDescripcionServicio(nombre)
    }
  })
  servicios.sort((s1, s2) => s1.horaInicio < s2.horaInicio ? -1 : (s1.horaInicio === s2.horaInicio && s1.nombre < s2.nombre ? -1 : 1))
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
  const inicio = format(fechaInicio, 'yyyy-MM-dd')
  const termino = format(fechaTermino, 'yyyy-MM-dd')
  const answersAPIResponse: any = get(`${API_ROOT}/answers/${servicio.id}?fecha_inicio=${inicio}%2000%3A00&fecha_termino=${termino}%2023%3A59`)
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
  const { nombreSucursalActiva } = useSelector((state: RootState) => state.sucursal)
  const queryClient = useQueryClient()
  const servicios = queryClient.getQueryData('servicios') as Servicio[]
  const servicioActivo: Servicio = servicios?.find(s => s.id === idServicioActivo) as Servicio
  return useQuery(
    ['servicio', idServicioActivo, fechaInicio, fechaTermino],
    async () => {
      const interacciones = await obtenerInteracciones(servicioActivo, fechaInicio, fechaTermino)
      interacciones.forEach(interaccion => {
        const interaccionCacheada: Interaccion | undefined = queryClient.getQueryData(['interaccion', idServicioActivo, interaccion.idUsuario])
        if (!interaccionCacheada) {
          queryClient.setQueryData(['interaccion', idServicioActivo, interaccion.idUsuario], interaccion)
        }
      })
      return interacciones
    },
    {
      select: interacciones => {
        return interacciones
          .filter(interaccion => idEstadoInteraccionActivo === 'CUALQUIERA' || idEstadoInteraccionActivo === interaccion.estadoInteraccion.id)
          .filter(interaccion => !nombreSucursalActiva || nombreSucursalActiva === interaccion.sucursal)
      },
      enabled: !!idServicioActivo && !!idEstadoInteraccionActivo,
      refetchInterval: 30_000
    }
  )
}

export const usePosiblesEstadosInteraccionesQuery = () => {
  const { idServicioActivo , fechaInicio, fechaTermino } = useSelector((state: RootState) => state.servicio)
  const { nombreSucursalActiva } = useSelector((state: RootState) => state.sucursal)
  const queryClient = useQueryClient()
  const servicios = queryClient.getQueryData('servicios') as Servicio[]
  const servicioActivo: Servicio = servicios?.find(s => s.id === idServicioActivo) as Servicio
  return useQuery(
    ['servicio', idServicioActivo, fechaInicio, fechaTermino],
    async () => {
      const interacciones = await obtenerInteracciones(servicioActivo, fechaInicio, fechaTermino)
      interacciones.forEach(interaccion => {
        const interaccionCacheada: Interaccion | undefined = queryClient.getQueryData(['interaccion', idServicioActivo, interaccion.idUsuario])
        queryClient.setQueryData(
          ['interaccion', idServicioActivo, interaccion.idUsuario],
          interaccionCacheada
            ? { ...interaccionCacheada, ...interaccion }
            : interaccion
        )
      })
      return interacciones
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!idServicioActivo,
      select: interacciones => estadosInteracciones.map(estado => {
        const interaccionesEstado = interacciones
          .filter(d => d.estadoInteraccion.id === estado.id)
          .filter(interaccion => !nombreSucursalActiva || nombreSucursalActiva === interaccion.sucursal)
        const interaccionesConComentarios = interaccionesEstado.filter(i => i.comentarios.length > 0)
        return {
          estado,
          conteo: interaccionesEstado.length,
          conteoComentarios: interaccionesConComentarios.length
        }
      })
    }
  )
}

const obtenerConversaciones = async (idServicio: number, idUsuario: number): Promise<{nombreBot: string, telefonoUsuario: string, conversaciones: Conversacion[]}> => {
  const response: chatAPIResponse = (await get(`${API_ROOT}/chat/${idServicio}/${idUsuario}`)).data
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
      refetchInterval: 30_000,
      enabled: !!idServicioInteraccionActiva && !!idUsuarioInteraccionActiva
    }
  )
}

const obtenerComentarios = async (idServicio: number, idUsuario: number, inicio: Date): Promise<Comentario[]> => {
  const response: reactionsAPIResponse = (await get(`${API_ROOT}/reactions/${idServicio}/${idUsuario}`)).data
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
      refetchInterval: 30_000,
      enabled: !!idServicioInteraccionActiva && !!idUsuarioInteraccionActiva && !!inicioInteraccionActiva,
    }
  )
}

const obtenerAlertas = async (diasAtras: number = 3): Promise<Alerta[]> => {
  const hoy = format(new Date(), 'yyyy-MM-dd')
  const hace7Dias = format(addDays(new Date(), -diasAtras), 'yyyy-MM-dd')
  const response: alertasAPIResponse = (await get(`${API_ROOT}/polls/alerts?start_date=${hace7Dias}&end_date=${hoy}`)).data
  return response.data.map((alertaAPI: any): Alerta => ({
    timestamp: parseISO(alertaAPI.utc_timestamp),
    texto: alertaAPI.message,
    resuelta: alertaAPI.dismissed,
    resueltaPor: alertaAPI.dismissal_by_username,
    id: alertaAPI.id,
    idServicio: alertaAPI.poll_id,
    idUsuario: alertaAPI.user_id,
  }))
}

export const useAlertasQuery = () => {

  const { data } = usePosiblesEstadosInteraccionesQuery()
  const queryClient = useQueryClient()

  return useQuery(
    'alertas',
    async () => {
      const alertas = await obtenerAlertas()
      alertas.forEach(alerta => {
        const queryKey = ['alertas', alerta.idServicio, alerta.idUsuario]
        const alertasPrevias: Alerta[] | undefined = queryClient.getQueryData(queryKey)
        queryClient.setQueryData(queryKey, alertasPrevias ? [...alertasPrevias, alerta] : [alerta])
      })
      return alertas
    },
    {
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
      enabled: !!data
    }
  )
}