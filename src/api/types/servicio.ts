export interface Servicio {
  id: number
  nombre: string
  horaInicio: string
  habilitado: boolean
  icono: string
  propiedades: PropiedadServicio[]
  sucursales: string[]
  descripcion: string
}

type TipoPropiedadServicio = 'META' | 'YESNO' | 'INTERNAL'

export interface PropiedadServicio {
  id: string
  nombre: string
  tipo: TipoPropiedadServicio
}

export interface Interaction {
  userId: number
  pollId: number
  start: Date
  appointments: Appointment[]
  branch?: string
  phone?: string
  messages?: Message[]
  comments?: Comment[]
  alerts?: Alerta[]
  botName?: string
}

export type SchedulingSystem = 'Dentalink' | 'Medilink' | 'Otro'

export interface Appointment {
  id?: string
  rut: string
  patientName: string
  status?: InteractionStatus
  datetime: Date
  url?: string
  schedulingSystem?: SchedulingSystem
}

export interface Pregunta {
  id: string
  texto: string
  respuesta: string
  tipo: TipoPropiedadServicio
}

export type IDEstadoInteraccion =
  | 'CUALQUIERA'
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'REAGENDADA'

export interface InteractionStatus {
  id: IDEstadoInteraccion
  descripcion?: string
  explicacion?: string
  icono: string
  color: string
}

export interface Message {
  timestamp: Date
  content: string
  sender: 'BOT' | 'USER'
  type: 'TEXTO' | 'AUDIO' | 'IMAGEN' | 'VIDEO'
  id: number
}

export interface Alerta {
  timestamp: Date
  texto: string
  resuelta: boolean
  resueltaPor?: string
  id: number
  idServicio: number
  idUsuario: number
}

export interface Comment {
  id: number
  timestamp: Date
  text: string
  emoji: string
}
