import axios from 'axios'
import store from '../redux/store'
import {
  Interaction,
  PropiedadServicio,
  Servicio,
  Appointment,
  InteractionStatus,
  IDEstadoInteraccion,
  Pregunta,
  Message,
  Comment,
  Alerta,
} from './types/servicio'
import {
  parse,
  format,
  parseISO,
  addHours,
  addDays,
  startOfDay,
  isSameDay,
  formatISO,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery, useQueryClient, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/ducks'
import { estadosInteracciones } from './estadosInteraccion'
import {
  alertasAPIResponse,
  chatAPIConversation,
  chatAPIResponse,
  reactionsAPIResponse,
  SearchAPIMultiAppointment,
  SearchAPISingleAppointment,
} from './types/responses'
import _ from 'lodash'

const API_ROOT = process.env.REACT_APP_API_ROOT

const get = async (url: string) => {
  const { login }: any = store.getState()
  const { token } = login
  return axios.get(url, { headers: { 'Api-Token': token } })
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
  const servicios: Servicio[] = headersAPIResponse.data.data.map(
    (headers: any): Servicio => {
      const servicio = serviciosQueVienenJuntoAlToken.find(
        (tipo: { id: any }) => tipo.id === headers.poll_id
      )
      const nombre = servicio.nombre.replace(nombreUsuario, '').trim()
      return {
        id: servicio.id,
        nombre,
        horaInicio: servicio.integrations[0]?.start_time || '0:00',
        habilitado: servicio.enabled,
        icono: obtenerIconoServicio(nombre),
        propiedades: headers.headers.map(
          (header: any): PropiedadServicio => ({
            id: header.name,
            nombre: header.display_name,
            tipo: header.type,
          })
        ),
        sucursales: servicio.sucursales,
        descripcion: obtenerDescripcionServicio(nombre),
      }
    }
  )
  servicios.sort((s1, s2) =>
    s1.horaInicio < s2.horaInicio
      ? -1
      : s1.horaInicio === s2.horaInicio && s1.nombre < s2.nombre
      ? -1
      : 1
  )
  return servicios
}

export const useServiciosQuery = () => {
  return useQuery('servicios', obtenerServicios, {
    refetchOnWindowFocus: false,
  })
}

const estadoInteraccionPorID = (id: IDEstadoInteraccion): InteractionStatus => {
  return estadosInteracciones.find((e) => e.id === id) as InteractionStatus
}

const obtenerEstadoInteraccionGeneral = (
  citas: Appointment[]
): InteractionStatus => {
  if (citas.some((cita) => cita.status?.id === 'REAGENDADA')) {
    return estadoInteraccionPorID('REAGENDADA')
  }
  if (citas.some((cita) => cita.status?.id === 'CANCELADA')) {
    return estadoInteraccionPorID('CANCELADA')
  }
  if (citas.some((cita) => cita.status?.id === 'CONFIRMADA')) {
    return estadoInteraccionPorID('CONFIRMADA')
  }
  return estadoInteraccionPorID('PENDIENTE')
}

const obtenerEstadoInteraccion = (preguntas: Pregunta[]): InteractionStatus => {
  const preguntaConfirmaYESNO = preguntas.find(
    (p) => p.tipo === 'YESNO' && p.texto.includes('Confirma')
  )
  const preguntaReagendaYESNO = preguntas.find(
    (p) => p.tipo === 'YESNO' && p.texto.includes('Reagenda')
  )
  if (preguntaReagendaYESNO) {
    if (
      preguntaReagendaYESNO.respuesta === 'YES' ||
      preguntaReagendaYESNO.respuesta === 'REAGENDA'
    ) {
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

const construirInteraccionCitaNormal = (
  interaccion: any,
  servicio: Servicio
): Interaction => {
  const preguntas: Pregunta[] = servicio.propiedades
    .filter((p) => p.tipo !== 'META')
    .map((p) => ({
      id: p.id,
      texto: p.nombre,
      respuesta: interaccion[p.id].tag,
      tipo: p.tipo,
    }))
  const estadoInteraccion: InteractionStatus =
    obtenerEstadoInteraccion(preguntas)
  const citas: Appointment[] = [
    {
      id: interaccion.id_cita,
      rut: interaccion.rut,
      patientName: interaccion.name,
      datetime: parse(
        `${interaccion.date} ${interaccion.time}`,
        interaccion.time.includes('M')
          ? "d 'de' MMMM h:m a"
          : "d 'de' MMMM H:m",
        parseISO(interaccion.start),
        { locale: es }
      ),
      status: estadoInteraccion,
    },
  ]
  return {
    branch: interaccion.sucursal_name,
    userId: interaccion.user_id,
    pollId: interaccion.poll_id,
    start: addHours(
      parseISO(interaccion.start),
      new Date().getTimezoneOffset() / -60
    ),
    appointments: citas,
    alerts: [],
    // comments: interaccion.reactions.map(
    //   (reaction: any): Comentario => ({
    //     id: reaction.id,
    //     timestamp: parseISO(reaction.created_at),
    //     texto: reaction.reaction_text,
    //     emoji: reaction.reaction_emoji,
    //   })
    // ),
  }
}

const construirInteraccionMulticita = (
  interaccion: any,
  servicio: Servicio
): Interaction => {
  const nCitas = Number(interaccion.n_appointments)
  const citas: Appointment[] = [...Array(nCitas)].map((_, i): Appointment => {
    const indiceCita = i + 1
    const preguntas: Pregunta[] = servicio.propiedades
      .filter((p) => p.tipo === 'YESNO' && p.id.endsWith(`${indiceCita}`))
      .map((p) => ({
        id: p.id,
        texto: p.nombre,
        respuesta: interaccion[p.id].tag,
        tipo: p.tipo,
      }))
    const estadoInteraccion = obtenerEstadoInteraccion(preguntas)
    return {
      id: interaccion[`id_cita_${indiceCita}`],
      rut: interaccion[`rut_${indiceCita}`],
      patientName: interaccion[`patient_name_${indiceCita}`],
      status: estadoInteraccion,
      datetime: new Date(),
    }
  })
  return {
    branch: interaccion['sucursal_name_1'],
    userId: interaccion['user_id'],
    pollId: interaccion.poll_id,
    start: addHours(
      parseISO(interaccion['start']),
      new Date().getTimezoneOffset() / -60
    ),
    appointments: citas,
    alerts: [],
    // comments: interaccion.reactions.map(
    //   (reaction: any): Comentario => ({
    //     id: reaction.id,
    //     timestamp: parseISO(reaction.created_at),
    //     texto: reaction.reaction_text,
    //     emoji: reaction.reaction_emoji,
    //   })
    // ),
  }
}

const obtenerInteracciones = async (
  servicio: Servicio,
  fechaInicio: Date = new Date(),
  fechaTermino: Date = new Date()
): Promise<Interaction[]> => {
  const inicio = format(fechaInicio, 'yyyy-MM-dd')
  const termino = format(fechaTermino, 'yyyy-MM-dd')
  const answersAPIResponse: any = get(
    `${API_ROOT}/answers/${servicio.id}?fecha_inicio=${inicio}%2000%3A00&fecha_termino=${termino}%2023%3A59`
  )
  const interacciones: Interaction[] = answersAPIResponse.data.data
    .filter((interaccion: any) => interaccion.started === 'True')
    .map((interaccion: any): Interaction => {
      return interaccion.n_appointments !== undefined
        ? construirInteraccionMulticita(interaccion, servicio)
        : construirInteraccionCitaNormal(interaccion, servicio)
    })
  interacciones.sort((i1, i2) =>
    (i1.appointments[0].datetime ?? -1) < (i2.appointments[0].datetime ?? 1)
      ? -1
      : 1
  )
  return interacciones
}

export const useInteraccionesServicioYEstadoActivosQuery = () => {
  const {
    idServicioActivo,
    idEstadoInteraccionActivo,
    fechaInicio,
    fechaTermino,
  } = useSelector((state: RootState) => state.servicio)
  const { nombreSucursalActiva } = useSelector(
    (state: RootState) => state.sucursal
  )
  const queryClient = useQueryClient()
  const servicios = queryClient.getQueryData('servicios') as Servicio[]
  const servicioActivo: Servicio = servicios?.find(
    (s) => s.id === idServicioActivo
  ) as Servicio
  return useQuery(
    ['servicio', idServicioActivo, fechaInicio, fechaTermino],
    async () => {
      const interacciones = await obtenerInteracciones(
        servicioActivo,
        fechaInicio,
        fechaTermino
      )
      interacciones.forEach((interaccion) => {
        const interaccionCacheada: Interaction | undefined =
          queryClient.getQueryData([
            'interaccion',
            idServicioActivo,
            interaccion.userId,
          ])
        if (!interaccionCacheada) {
          queryClient.setQueryData(
            ['interaccion', idServicioActivo, interaccion.userId],
            interaccion
          )
        }
      })
      return interacciones
    },
    {
      select: (interacciones) => {
        return interacciones
          .filter((interaccion) => idEstadoInteraccionActivo === 'CUALQUIERA')
          .filter(
            (interaccion) =>
              !nombreSucursalActiva ||
              nombreSucursalActiva === interaccion.branch
          )
      },
      enabled: !!idServicioActivo && !!idEstadoInteraccionActivo,
      refetchInterval: 30_000,
    }
  )
}

export const usePosiblesEstadosInteraccionesQuery = () => {
  const { idServicioActivo, fechaInicio, fechaTermino } = useSelector(
    (state: RootState) => state.servicio
  )
  const { nombreSucursalActiva } = useSelector(
    (state: RootState) => state.sucursal
  )
  const queryClient = useQueryClient()
  const servicios = queryClient.getQueryData('servicios') as Servicio[]
  const servicioActivo: Servicio = servicios?.find(
    (s) => s.id === idServicioActivo
  ) as Servicio
  return useQuery(
    ['servicio', idServicioActivo, fechaInicio, fechaTermino],
    async () => {
      const interacciones = await obtenerInteracciones(
        servicioActivo,
        fechaInicio,
        fechaTermino
      )
      interacciones.forEach((interaccion) => {
        const interaccionCacheada: Interaction | undefined =
          queryClient.getQueryData([
            'interaccion',
            idServicioActivo,
            interaccion.userId,
          ])
        queryClient.setQueryData(
          ['interaccion', idServicioActivo, interaccion.userId],
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
      select: (interacciones) =>
        estadosInteracciones.map((estado) => {
          const interaccionesEstado = interacciones.filter(
            (interaccion) =>
              !nombreSucursalActiva ||
              nombreSucursalActiva === interaccion.branch
          )
          const interaccionesConComentarios = interaccionesEstado.filter(
            (i) => i.comments && i.comments.length > 0
          )
          return {
            estado,
            conteo: interaccionesEstado.length,
            conteoComentarios: interaccionesConComentarios.length,
          }
        }),
    }
  )
}

const obtenerConversaciones = async (
  idServicio: number,
  idUsuario: number
): Promise<{
  nombreBot: string
  telefonoUsuario: string
  conversaciones: Message[]
}> => {
  const response: chatAPIResponse = (
    await get(`${API_ROOT}/chat/${idServicio}/${idUsuario}`)
  ).data
  const nombreBot = response.data.bot.name
  const telefonoUsuario = response.data.user.phone
  const conversaciones: Message[] = []
  return {
    nombreBot,
    telefonoUsuario,
    conversaciones,
  }
}

export const useInteraccionActivaQuery = () => {
  const { idServicioInteraccionActiva, idUsuarioInteraccionActiva } =
    useSelector((state: RootState) => state.interaccion)
  const queryClient = useQueryClient()
  return useQuery(
    ['interaccion', idServicioInteraccionActiva, idUsuarioInteraccionActiva],
    async () => {
      const datosExtra = await obtenerConversaciones(
        idServicioInteraccionActiva as number,
        idUsuarioInteraccionActiva as number
      )
      const interaccion = queryClient.getQueryData([
        'interaccion',
        idServicioInteraccionActiva,
        idUsuarioInteraccionActiva,
      ]) as Interaction
      const interaccionCompleta = {
        ...interaccion,
        ...datosExtra,
      }
      queryClient.setQueryData(
        [
          'interaccion',
          idServicioInteraccionActiva,
          idUsuarioInteraccionActiva,
        ],
        interaccionCompleta
      )
      return interaccionCompleta
    },
    {
      refetchInterval: 30_000,
      enabled: !!idServicioInteraccionActiva && !!idUsuarioInteraccionActiva,
    }
  )
}

const obtenerComentarios = async (
  idServicio: number,
  idUsuario: number,
  inicio: Date
): Promise<Comment[]> => {
  const response: reactionsAPIResponse = (
    await get(`${API_ROOT}/reactions/${idServicio}/${idUsuario}`)
  ).data
  const comentarios: Comment[] = response.data.map((c: any): Comment => {
    return {
      id: c.id,
      timestamp: parseISO(c.created_at),
      text: c.reaction_text,
      emoji: c.reaction_emoji,
    }
  })
  comentarios.sort((c1, c2) => (c1.timestamp < c2.timestamp ? -1 : 1))
  return comentarios
}

export const useComentariosInteraccionActivaQuery = () => {
  const {
    idServicioInteraccionActiva,
    idUsuarioInteraccionActiva,
    inicioInteraccionActiva,
  } = useSelector((state: RootState) => state.interaccion)
  const queryClient = useQueryClient()
  return useQuery(
    [
      'comentarios',
      idServicioInteraccionActiva,
      idUsuarioInteraccionActiva,
      inicioInteraccionActiva,
    ],
    async () => {
      const comentarios = await obtenerComentarios(
        idServicioInteraccionActiva as number,
        idUsuarioInteraccionActiva as number,
        inicioInteraccionActiva as Date
      )
      const interaccion = queryClient.getQueryData([
        'interaccion',
        idServicioInteraccionActiva,
        idUsuarioInteraccionActiva,
      ]) as Interaction
      const interaccionCompleta: Interaction = {
        ...interaccion,
        comments: comentarios,
      }
      queryClient.setQueryData(
        [
          'interaccion',
          idServicioInteraccionActiva,
          idUsuarioInteraccionActiva,
        ],
        interaccionCompleta
      )
      return interaccionCompleta
    },
    {
      refetchInterval: 30_000,
      enabled:
        !!idServicioInteraccionActiva &&
        !!idUsuarioInteraccionActiva &&
        !!inicioInteraccionActiva,
    }
  )
}

const obtenerAlertas = async (diasAtras: number = 3): Promise<Alerta[]> => {
  const hoy = format(new Date(), 'yyyy-MM-dd')
  const hace7Dias = format(addDays(new Date(), -diasAtras), 'yyyy-MM-dd')
  const response: alertasAPIResponse = (
    await get(
      `${API_ROOT}/polls/alerts?start_date=${hace7Dias}&end_date=${hoy}`
    )
  ).data
  return response.data.map(
    (alertaAPI: any): Alerta => ({
      timestamp: parseISO(alertaAPI.utc_timestamp),
      texto: alertaAPI.message,
      resuelta: alertaAPI.dismissed,
      resueltaPor: alertaAPI.dismissal_by_username,
      id: alertaAPI.id,
      idServicio: alertaAPI.poll_id,
      idUsuario: alertaAPI.user_id,
    })
  )
}

export const useAlertasQuery = () => {
  const { data } = usePosiblesEstadosInteraccionesQuery()
  const queryClient = useQueryClient()

  return useQuery(
    'alertas',
    async () => {
      const alertas = await obtenerAlertas()
      alertas.forEach((alerta) => {
        const queryKey = ['alertas', alerta.idServicio, alerta.idUsuario]
        const alertasPrevias: Alerta[] | undefined =
          queryClient.getQueryData(queryKey)
        queryClient.setQueryData(
          queryKey,
          alertasPrevias ? [...alertasPrevias, alerta] : [alerta]
        )
      })
      return alertas
    },
    {
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
      enabled: !!data,
    }
  )
}

const parseDate = (
  appointmentDate: string,
  appointmentTime: string,
  referenceISODate: string
) => {
  if (!appointmentDate) {
    return startOfDay(parseISO(referenceISODate))
  }
  if (!appointmentTime) {
    return parse(
      appointmentDate,
      "d 'de' MMMM",
      startOfDay(parseISO(referenceISODate)),
      { locale: es }
    )
  }
  return parse(
    `${appointmentDate} ${appointmentTime}`,
    appointmentTime.includes('M') ? "d 'de' MMMM h:m a" : "d 'de' MMMM H:m",
    parseISO(referenceISODate),
    { locale: es }
  )
}

const searchSingleAppointmentToInteraction = (
  appointment: SearchAPISingleAppointment
): Interaction => {
  return {
    start: addHours(
      parseISO(appointment.start),
      Number(process.env.REACT_APP_UTC_OFFSET)
    ),
    userId: appointment.user_id,
    pollId: appointment.poll_id,
    branch: appointment.sucursal_name,
    phone: appointment.phone,
    appointments: [
      {
        datetime: parseDate(
          appointment.date,
          appointment.time,
          appointment.start
        ),
        patientName: appointment.name,
        rut: appointment.rut,
        id: appointment.id_cita,
        url: appointment.dentalink_link,
      },
    ],
  }
}

const searchMultiAppointmentToInteraction = (
  appointment: SearchAPIMultiAppointment
): Interaction => {
  return {
    start: addHours(
      parseISO(appointment.start),
      Number(process.env.REACT_APP_UTC_OFFSET)
    ),
    userId: appointment.user_id,
    pollId: appointment.poll_id,
    branch: appointment.sucursal_name_1 || appointment.sucursal_name,
    phone: appointment.phone,
    appointments: Array(Number(appointment.n_appointments))
      .fill(0)
      .map<Appointment>((_, i): Appointment => {
        const index = i + 1
        const appointment_time =
          (appointment[
            `time_${index}` as keyof SearchAPIMultiAppointment
          ] as string) || ''
        return {
          datetime: parseDate(
            appointment.date_1,
            appointment_time,
            appointment.start
          ),
          patientName: appointment[
            `patient_name_${index}` as keyof SearchAPIMultiAppointment
          ] as string,
          rut: appointment[
            `rut_${index}` as keyof SearchAPIMultiAppointment
          ] as string,
          id: appointment[
            `id_cita_${index}` as keyof SearchAPIMultiAppointment
          ] as string,
        }
      }),
  }
}

export const useSearchQuery = (
  term: String
): UseQueryResult<Interaction[], unknown> => {
  return useQuery(['search', term], async () => {
    if (!term) {
      return []
    }
    const { data } = await get(`https://api.botlab.cl/answers_es?query=${term}`)
    const interactions = data.data.map((searchResult: any): Interaction => {
      const nAppointments = Number(searchResult.n_appointments || 1)
      return nAppointments > 1
        ? searchMultiAppointmentToInteraction(
            searchResult as SearchAPIMultiAppointment
          )
        : searchSingleAppointmentToInteraction(
            searchResult as SearchAPISingleAppointment
          )
    })
    return _.orderBy(interactions, 'start', 'desc')
  })
}

const getClosestConversation = (
  conversationsData: chatAPIConversation[],
  start: Date
): [chatAPIConversation, number] => {
  const sameDayConversationIndex = conversationsData.findIndex((c: any) =>
    isSameDay(parseISO(c.start), start)
  )
  if (sameDayConversationIndex < 0) {
    return [conversationsData[0], 0]
  }
  return [conversationsData[sameDayConversationIndex], sameDayConversationIndex]
}

export const usePollInteractionsForUserQuery = (
  pollId: number,
  userId: number,
  start: Date
): UseQueryResult<Interaction, unknown> => {
  return useQuery<any, any, Interaction>(
    ['interaction', pollId, userId, start],
    async () => {
      const { data }: { data: chatAPIResponse } = await get(
        `${API_ROOT}/chat/${pollId}/${userId}`
      )
      const [conversation, index] = getClosestConversation(
        data.data.conversations.filter((c) => !_.isEmpty(c.context)),
        start
      )
      const appointment = data.data._appointment_metas[index]
      const interaction: Interaction = {
        userId,
        pollId,
        start: addHours(
          parseISO(conversation.start),
          Number(process.env.REACT_APP_UTC_OFFSET)
        ),
        appointments: [
          {
            datetime: parseDate(
              appointment.date,
              appointment.time,
              formatISO(start)
            ),
            rut: appointment.rut,
            patientName: appointment.name || appointment.patient_name_1,
            url: appointment.dentalink_link,
          },
        ],
        branch: '',
        phone: data.data.user.phone,
        messages: conversation.messages.map(
          (message): Message => ({
            sender: message.type === 'bot' ? 'BOT' : 'USER',
            content: message.message,
            timestamp: parseISO(message.timestamp),
            type: 'TEXTO',
          })
        ),
        alerts: [],
        comments: [],
        botName: data.data.bot.name,
      }
      return interaction
    }
  )
}
