import store from '../redux/store'
import {
  Interaction,
  ServiceHeader,
  Service,
  Appointment,
  InteractionStatus,
  IDEstadoInteraccion,
  Pregunta,
  Message,
  Comment,
  Alerta,
} from './types/servicio'
import { parse, format, parseISO, addHours, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/ducks'
import { estadosInteracciones } from './estadosInteraccion'
import {
  alertasAPIResponse,
  chatAPIResponse,
  reactionsAPIResponse,
} from './types/responses'
import { get } from './hooks/utils'

const API_ROOT = process.env.REACT_APP_API_ROOT

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
    }
  )
}
