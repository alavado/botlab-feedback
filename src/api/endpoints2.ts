import { IconifyIcon } from '@iconify/types'
import axios from 'axios'
import store from '../redux/store'
import { PropiedadServicio, Servicio } from './types/servicio'
import iconoConfirmacion from '@iconify/icons-mdi/user'
import iconoConfirmacionMulticita from '@iconify/icons-mdi/users'

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

export const obtenerServicios = async (): Promise<Array<Servicio>> => {
  const { login, encuestas }: any = store.getState()
  const { token, nombreUsuario } = login
  const url = `${API_ROOT}/polls_headers`
  const headersAPI: any = await axios.get(url, { headers: { 'Api-Token': token } })
  const serviciosQueVienenJuntoAlToken = encuestas.tipos
  const servicios: Array<Servicio> = headersAPI.data.data.map((headers: any): Servicio => {
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

