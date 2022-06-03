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
  estadoInteraccion: EstadoInteraccion,
  inicio: Date,
  citas: Cita[],
  nombreBot?: string,
  telefonoUsuario?: string,
  conversaciones?: Conversacion[],
}

export interface Cita {
  id: number,
  rut: string,
  nombre: string,
  estadoInteraccion: EstadoInteraccion,
  fecha?: Date,
  responsable?: string,
  preguntas: Pregunta[]
}

export interface Pregunta {
  id: string,
  texto: string,
  respuesta: string,
}

export type IDEstadoInteraccion = 'CUALQUIERA' | 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'REAGENDADA' | 'IMPROCESABLE'

export interface EstadoInteraccion {
  id: IDEstadoInteraccion,
  descripcion?: string,
  icono: IconifyIcon
}

export interface Conversacion {
  inicio: Date,
  mensajes: Mensaje[],
}

export interface Mensaje {
  timestamp: Date,
  mensaje: String,
  emisor: 'BOT' | 'USUARIO',
  tipo: 'TEXTO' | 'AUDIO' | 'IMAGEN' | 'VIDEO'
}