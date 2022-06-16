import { IconifyIcon } from '@iconify/types'

export interface Servicio {
  id: number,
  nombre: string,
  horaInicio: string,
  habilitado: boolean,
  icono: IconifyIcon,
  propiedades: PropiedadServicio[]
}

type TipoPropiedadServicio = 'META' | 'YESNO' | 'INTERNAL'

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
  alertas: Alerta[],
  comentarios: Comentario[]
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
  tipo: TipoPropiedadServicio
}

export type IDEstadoInteraccion = 'CUALQUIERA' | 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'REAGENDADA' | 'IMPROCESABLE'

export interface EstadoInteraccion {
  id: IDEstadoInteraccion,
  descripcion?: string,
  explicacion?: string,
  icono: IconifyIcon
}

export interface Conversacion {
  inicio: Date,
  mensajes: Mensaje[]
}

export interface Mensaje {
  timestamp: Date,
  mensaje: String,
  emisor: 'BOT' | 'USUARIO',
  tipo: 'TEXTO' | 'AUDIO' | 'IMAGEN' | 'VIDEO'
}

export interface Alerta {
  timestamp: Date,
  texto: string,
  resuelta: boolean,
  resueltaPor?: string
}

export interface Comentario {
  id: number,
  timestamp: Date,
  texto: string,
  emoji: string
}