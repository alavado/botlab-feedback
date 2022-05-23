import { IconifyIcon } from '@iconify/types'
import axios from 'axios'
import store from '../redux/store'
import { Interaccion, PropiedadServicio, Servicio, Cita, ResultadoInteraccion } from './types/servicio'
import { parse, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/ducks'
import iconoConfirmacion from '@iconify/icons-mdi/user'
import iconoConfirmacionMulticita from '@iconify/icons-mdi/users'

// iconos para resultados de interacciones
import iconoResultadoPendiente from '@iconify/icons-mdi/flask-empty'
import iconoResultadoConfirma from '@iconify/icons-mdi/check'
import iconoResultadoCancela from '@iconify/icons-mdi/cancel'
import iconoResultadoReagenda from '@iconify/icons-mdi/arrow-decision'
import iconoResultadoOut from '@iconify/icons-mdi/question-mark'

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

const resultadosInteracciones: ResultadoInteraccion[] = [
  {
    id: 'PENDIENTE',
    descripcion: 'Paciente aún no responde',
    icono: iconoResultadoPendiente
  },
  {
    id: 'CONFIRMADA',
    descripcion: 'Paciente confirma su hora',
    icono: iconoResultadoConfirma
  },
  {
    id: 'CANCELADA',
    descripcion: 'Paciente anula hora',
    icono: iconoResultadoCancela
  },
  {
    id: 'REAGENDADA',
    descripcion: 'Paciente reagenda hora',
    icono: iconoResultadoReagenda
  },
  {
    id: 'IMPROCESABLE',
    descripcion: 'Bot pudo entender',
    icono: iconoResultadoOut
  },
]

const obtenerResultadoInteraccion = (): ResultadoInteraccion => {
  return resultadosInteracciones[0]
}

const construirInteraccionMulticita = (interaccion: any): Interaccion => {
  return {
    sucursal: interaccion['sucursal_name_1'],
    idUsuario: interaccion['user_id'],
    citas: Array(Number(interaccion.n_appointments)).fill(0).map((_, i): Cita => {
      const indiceCita = i + 1
      return {
        id: interaccion[`id_cita_${indiceCita}`],
        rut: interaccion[`rut_${indiceCita}`],
        nombre: interaccion[`patient_name_${indiceCita}`],
        resultadoInteraccion: obtenerResultadoInteraccion()
      }
    })
  }
}

const construirInteraccionCitaNormal = (interaccion: any): Interaccion => {
  return {
    sucursal: interaccion['sucursal_name'],
    idUsuario: interaccion['user_id'],
    citas: [{
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
      resultadoInteraccion: obtenerResultadoInteraccion()
    }]
  }
}

const obtenerInteracciones = async (): Promise<Interaccion[]> => {
  const { login, servicio: { idServicioActivo, fechaInicio, fechaTermino } }: any = store.getState()
  const { token } = login
  const inicio = format(fechaInicio, 'yyyy-MM-dd')
  const termino = format(fechaTermino, 'yyyy-MM-dd')
  const url = `${API_ROOT}/answers/${idServicioActivo}?fecha_inicio=${inicio}%2000%3A00&fecha_termino=${termino}%2023%3A59`
  const answersAPIResponse: any = await axios.get(url, { headers: { 'Api-Token': token } })
  const interacciones = answersAPIResponse.data.data.map((interaccion: any): Interaccion => {
    return interaccion.n_appointments !== undefined
      ? construirInteraccionMulticita(interaccion)
      : construirInteraccionCitaNormal(interaccion)
  })
  return interacciones
}

export const useInteraccionesQuery = () => {
  const { idServicioActivo } = useSelector((state: RootState) => state.servicio)
  return useQuery(
    ['servicio', idServicioActivo],
    obtenerInteracciones
  )
}

const obtenerPosiblesResultadosInteracciones = async (): Promise<ResultadoInteraccion[]> => {
  return resultadosInteracciones
}

export const usePosiblesResultadosInteraccionesQuery = () => {
  const { data } = useServiciosQuery()
  return useQuery(
    'posibles_resultados_citas',
    obtenerPosiblesResultadosInteracciones,
    {
      refetchOnWindowFocus: false,
      enabled: !!data
    }
  )
}