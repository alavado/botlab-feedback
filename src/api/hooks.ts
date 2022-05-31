import { IconifyIcon } from '@iconify/types'
import axios from 'axios'
import store from '../redux/store'
import { Interaccion, PropiedadServicio, Servicio, Cita, EstadoInteraccion, IDEstadoInteraccion, Pregunta } from './types/servicio'
import { parse, format, parseISO, addHours } from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/ducks'
import iconoConfirmacion from '@iconify/icons-mdi/user'
import iconoConfirmacionMulticita from '@iconify/icons-mdi/users'
import { estadosInteracciones } from './estadosInteraccion'

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
  const preguntaConfirma = preguntas.find(p => p.texto.includes('Confirma'))
  const preguntaReagenda = preguntas.find(p => p.texto.includes('Reagenda'))
  if (preguntaReagenda && (preguntaReagenda.respuesta === 'YES' || preguntaReagenda.respuesta === 'REAGENDA')) {
    return estadoInteraccionPorID('REAGENDADA')
  }
  if (preguntaConfirma) {
    if (preguntaConfirma.respuesta === 'NO') {
      return estadoInteraccionPorID('CANCELADA')
    }
    if (preguntaConfirma.respuesta === 'YES') {
      return estadoInteraccionPorID('CONFIRMADA')
    }
  }
  return estadoInteraccionPorID('PENDIENTE')
}

const construirInteraccionCitaNormal = (interaccion: any, servicio: Servicio): Interaccion => {
  const preguntas: Pregunta[] = servicio.propiedades
    .filter(p => p.tipo === 'YESNO')
    .map(p => ({
      id: p.id,
      texto: p.nombre,
      respuesta: interaccion[p.id].tag,
    }))
  const estadoInteraccion: EstadoInteraccion = obtenerEstadoInteraccion(preguntas)
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
    estadoInteraccion,
    preguntas
  }]
  return {
    sucursal: interaccion['sucursal_name'],
    idUsuario: interaccion['user_id'],
    inicio: addHours(parseISO(interaccion['start']), new Date().getTimezoneOffset() / -60),
    estadoInteraccion,
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
    citas
  }
}

const obtenerInteracciones = async (servicio: Servicio, fechaInicio: Date = new Date(), fechaTermino: Date = new Date()): Promise<Interaccion[]> => {
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
      select: data => data.filter(d => idEstadoInteraccionActivo === 'CUALQUIERA' || idEstadoInteraccionActivo === d.estadoInteraccion.id),
      enabled: !!idServicioActivo && !!idEstadoInteraccionActivo
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
      select: () => estadosInteracciones
    }
  )
}
