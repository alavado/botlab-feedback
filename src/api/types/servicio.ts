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

export type IDEstadoInteraccion = 'CUALQUIERA' | 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'REAGENDADA'

export interface EstadoInteraccion {
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
