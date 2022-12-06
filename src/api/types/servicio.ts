export interface Servicio {
  id: number,
  nombre: string,
  horaInicio: string,
  habilitado: boolean,
  icono: string,
  propiedades: PropiedadServicio[],
  sucursales: string[],
  descripcion: string
}

type TipoPropiedadServicio = 'META' | 'YESNO' | 'INTERNAL'

export interface PropiedadServicio {
  id: string,
  nombre: string,
  tipo: TipoPropiedadServicio
}

export interface Interaction {
  userId: number,
  start: Date,
  appointments: Appointment[],
  sucursal?: string,
  nombreBot?: string,
  telefonoUsuario?: string,
  conversaciones?: Conversacion[],
  alertas?: Alerta[],
  comentarios?: Comentario[]
}

export interface Appointment {
  rut: string,
  nombre: string,
  estadoInteraccion: InteractionStatus,
  fecha: Date,
  id?: number,
  responsable?: string
}

export interface Pregunta {
  id: string,
  texto: string,
  respuesta: string,
  tipo: TipoPropiedadServicio
}

export type IDEstadoInteraccion = 'CUALQUIERA' | 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'REAGENDADA'

export interface InteractionStatus {
  id: IDEstadoInteraccion,
  descripcion?: string,
  explicacion?: string,
  icono: string,
  color: string
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
  resueltaPor?: string,
  id: number,
  idServicio: number,
  idUsuario: number,
}

export interface Comentario {
  id: number,
  timestamp: Date,
  texto: string,
  emoji: string
}
