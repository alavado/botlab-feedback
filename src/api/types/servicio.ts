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
  resultadoInteraccion: ResultadoInteraccion,
  fecha?: Date,
  responsable?: string,
}

export type IDResultadoInteraccion = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'REAGENDADA' | 'IMPROCESABLE'

export interface ResultadoInteraccion {
  id: IDResultadoInteraccion,
  descripcion?: string,
  icono: IconifyIcon
}