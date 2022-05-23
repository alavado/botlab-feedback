import { IconifyIcon } from '@iconify/types'

export interface Servicio {
  id: number,
  nombre: string,
  horaInicio: string,
  habilitado: boolean,
  icono: IconifyIcon,
  propiedades: PropiedadServicio[]
}

type TipoPropiedadServicio = 'META' | 'YESNO'

export interface PropiedadServicio {
  id: string,
  nombre: string,
  tipo: TipoPropiedadServicio
}

export interface Interaccion {
  sucursal: string,
  idUsuario: number,
  citas: Cita[]
}

export interface Cita {
  id: number,
  rut: string,
  nombre: string,
  estadoInteraccion: EstadoInteraccion,
  fecha?: Date,
  responsable?: string,
}

export type IDEstadoInteraccion = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'REAGENDADA' | 'IMPROCESABLE'

export interface EstadoInteraccion {
  id: IDEstadoInteraccion,
  descripcion?: string,
  icono: IconifyIcon
}