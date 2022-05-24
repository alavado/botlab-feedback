import { IconifyIcon } from '@iconify/types'
import axios from 'axios'
import store from '../redux/store'
import { Interaccion, PropiedadServicio, Servicio, Cita, EstadoInteraccion, IDEstadoInteraccion, Pregunta } from './types/servicio'
import { parse, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/ducks'
import iconoConfirmacion from '@iconify/icons-mdi/user'
import iconoConfirmacionMulticita from '@iconify/icons-mdi/users'

// iconos para resultados de interacciones
import iconoEstadoPendiente from '@iconify/icons-mdi/timer-sand'
import iconoEstadoConfirma from '@iconify/icons-mdi/check'
import iconoEstadoCancela from '@iconify/icons-mdi/cancel'
import iconoEstadoReagenda from '@iconify/icons-mdi/change-history'
import iconoEstadoOut from '@iconify/icons-mdi/robot-angry'

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
    const nombre = servicio.nombre.substring(servicio.nombre.indexOf(nombreUsuario) + nombreUsuario.length + 1)
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

const estadosInteracciones: EstadoInteraccion[] = [
  {
    id: 'PENDIENTE',
    descripcion: 'Usuario aún no responde',
    icono: iconoEstadoPendiente
  },
  {
    id: 'CONFIRMADA',
    descripcion: 'Usuario confirma cita',
    icono: iconoEstadoConfirma
  },
  {
    id: 'CANCELADA',
    descripcion: 'Usuario anula cita',
    icono: iconoEstadoCancela
  },
  {
    id: 'REAGENDADA',
    descripcion: 'Usuario reagenda cita',
    icono: iconoEstadoReagenda
  },
  {
    id: 'IMPROCESABLE',
    descripcion: 'Bot pudo entender',
    icono: iconoEstadoOut
  },
]

const obtenerIDEstadoInteraccionGeneral = (citas: Cita[]): IDEstadoInteraccion => {
  if (citas.some(cita => cita.idEstadoInteraccion === 'IMPROCESABLE')) {
    return 'IMPROCESABLE'
  }
  if (citas.some(cita => cita.idEstadoInteraccion === 'REAGENDADA')) {
    return 'REAGENDADA'
  }
  if (citas.some(cita => cita.idEstadoInteraccion === 'CANCELADA')) {
    return 'CANCELADA'
  }
  if (citas.some(cita => cita.idEstadoInteraccion === 'CONFIRMADA')) {
    return 'CONFIRMADA'
  }
  return 'PENDIENTE'
}

const obtenerIDEstadoInteraccion = (preguntas: Pregunta[]): IDEstadoInteraccion => {
  const preguntaConfirma = preguntas.find(p => p.texto.includes('Confirma'))
  const preguntaReagenda = preguntas.find(p => p.texto.includes('Reagenda'))
  if (preguntaReagenda && (preguntaReagenda.respuesta === 'YES' || preguntaReagenda.respuesta === 'REAGENDA')) {
    return 'REAGENDADA'
  }
  if (preguntaConfirma) {
    if (preguntaConfirma.respuesta === 'NO') {
      return 'CANCELADA'
    }
    if (preguntaConfirma.respuesta === 'YES') {
      return 'CONFIRMADA'
    }
  }
  return 'PENDIENTE'
}

const construirInteraccionCitaNormal = (interaccion: any, servicio: Servicio): Interaccion => {
  const preguntas: Pregunta[] = servicio.propiedades
    .filter(p => p.tipo === 'YESNO')
    .map(p => ({
      id: p.id,
      texto: p.nombre,
      respuesta: interaccion[p.id].tag,
    }))
  const idEstadoInteraccion = obtenerIDEstadoInteraccion(preguntas)
  const citas: Cita[] = [{
    id: interaccion['id_cita'],
    rut: interaccion['rut'],
    nombre: interaccion['name'],
    fecha: parse(
      `${interaccion['date']} ${interaccion['time']}`,
      interaccion['time'].includes('M') ? 'd \'de\' MMMM h:m a' : 'd \'de\' MMMM H:m',
      parseISO(interaccion['start']),
      { locale: es }
    ),
    responsable: interaccion['dentist_name'],
    idEstadoInteraccion,
    preguntas
  }]
  return {
    sucursal: interaccion['sucursal_name'],
    idUsuario: interaccion['user_id'],
    idEstadoInteraccion,
    citas
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
      }))
    const idEstadoInteraccion = obtenerIDEstadoInteraccion(preguntas)
    return {
      id: interaccion[`id_cita_${indiceCita}`],
      rut: interaccion[`rut_${indiceCita}`],
      nombre: interaccion[`patient_name_${indiceCita}`],
      idEstadoInteraccion,
      preguntas
    }
  })
  return {
    sucursal: interaccion['sucursal_name_1'],
    idUsuario: interaccion['user_id'],
    idEstadoInteraccion: obtenerIDEstadoInteraccionGeneral(citas),
    citas
  }
}

const obtenerInteracciones = async (servicio: Servicio, fechaInicio: Date, fechaTermino: Date): Promise<Interaccion[]> => {
  const { login }: any = store.getState()
  const { token } = login
  const inicio = format(fechaInicio, 'yyyy-MM-dd')
  const termino = format(fechaTermino, 'yyyy-MM-dd')
  const url = `${API_ROOT}/answers/${servicio.id}?fecha_inicio=${inicio}%2000%3A00&fecha_termino=${termino}%2023%3A59`
  const answersAPIResponse: any = await axios.get(url, { headers: { 'Api-Token': token } })
  const interacciones: Interaccion[] = answersAPIResponse.data.data.map((interaccion: any): Interaccion => {
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
      select: data => data.filter(d => idEstadoInteraccionActivo === 'CUALQUIERA' || d.idEstadoInteraccion === idEstadoInteraccionActivo),
      enabled: !!idServicioActivo && !!idEstadoInteraccionActivo
    }
  )
}

const obtenerPosiblesEstadosInteracciones = async (): Promise<EstadoInteraccion[]> => {
  return estadosInteracciones
}

export const usePosiblesEstadosInteraccionesQuery = () => {
  const { idServicioActivo } = useSelector((state: RootState) => state.servicio)
  return useQuery(
    'posibles_estados_interacciones',
    obtenerPosiblesEstadosInteracciones,
    {
      refetchOnWindowFocus: false,
      enabled: !!idServicioActivo
    }
  )
}
