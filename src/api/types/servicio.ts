export interface Service {
  id: number
  name: string
  headers: ServiceHeader[]
}

type ServiceHeaderType = 'META' | 'YESNO' | 'INTERNAL' | 'RANGE' | 'OPEN'

export interface ServiceHeader {
  name: string
  displayName: string
  type: ServiceHeaderType
}

export interface Branch {
  id: string
  name: string
}

export interface Interaction {
  patientId: number
  serviceId: number
  start: Date
  appointments: Appointment[]
  branch?: string
  phone?: string
  messages?: Message[]
  comments?: Comment[]
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
  tipo: ServiceHeaderType
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

export interface Alert {
  id: number
  timestamp: Date
  formattedTimestamp: string
  solved: boolean
  solvedBy?: string
  typeId: AlertType['id']
  typeName?: AlertType['name']
  serviceId: number
  patientName: string
  patientId: number
  branchId: string
}

export interface AlertType {
  id: string
  name: string
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

export type BranchId = Branch['id']
export type ServiceId = Service['id']
export type AlertTypeId = AlertType['id']
export type PatientId = Interaction['patientId']
