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
  levels: string[]
}

export interface Branch {
  id: string
  name: string
}

export type InteractionStatus =
  | 'UNANSWERED_WHATSAPP'
  | 'UNREACHABLE_WHATSAPP'
  | 'ANSWERED_WHATSAPP'
  | 'CONFIRMED_WHATSAPP'
  | 'CANCELLED_WHATSAPP'
  | 'RESCHEDULED_WHATSAPP'
  | 'OTHER'

export interface InteractionId {
  serviceId: ServiceId
  patientId: number
  start: Date
}

export interface Interaction {
  id: InteractionId
  appointments: Appointment[]
  branch?: string
  phone?: string
  messages?: Message[]
  comments?: Comment[]
  botName?: string
  extraData: InteractionExtraData[]
  status: InteractionStatus
  normalized: string
}

export const tagPreffix = 'TAG:'

export type Tag =
  | 'YES'
  | 'NO'
  | 'REAGENDA'
  | 'OUT'
  | 'OTRO'
  | 'SIN RESPUESTA'
  | 'UNREACHABLE'

export const isTag = (stuff: any): stuff is Tag => {
  return (
    ['YES', 'NO', 'REAGENDA', 'OUT', 'SIN RESPUESTA', 'UNREACHABLE'].includes(
      stuff
    ) || stuff.startsWith(tagPreffix)
  )
}

export interface InteractionExtraData {
  header: string
  value: string
}

export type SchedulingSystem = 'Dentalink' | 'Medilink' | 'Otro'
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'OTHER'

export interface Appointment {
  id?: string
  rut: string
  patientName: string
  datetime: Date
  url?: string
  schedulingSystem?: SchedulingSystem
  status: AppointmentStatus
}

export interface Message {
  timestamp: Date
  content: string
  sender: 'BOT' | 'USER'
  type: 'TEXTO' | 'AUDIO' | 'IMAGEN' | 'VIDEO'
  id: number
  tag?: string
}

export interface Alert {
  id: number
  timestamp: Date
  formattedTimestamp: string
  solved: boolean
  solvedBy?: string
  typeId: AlertTypeId
  typeName?: AlertType['name']
  serviceId: ServiceId
  serviceName?: Service['name']
  patientName: string
  patientId: PatientId
  branchId: Branch['id']
  branchName?: Branch['name']
}

export interface AlertType {
  id: string
  name: string
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
export type PatientId = InteractionId['patientId']
export type AlertId = Alert['id']
export type CommentId = Comment['id']
