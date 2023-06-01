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
  serviceId: ServiceId
  start: Date
  appointments: Appointment[]
  branch?: string
  phone?: string
  messages?: Message[]
  comments?: Comment[]
  botName?: string
  meta: InteractionMeta[]
}

export type Tag = 'YES' | 'NO' | 'REAGENDA' | 'OUT' | 'SIN RESPUESTA'

export const isTag = (stuff: any): stuff is Tag => {
  return ['YES', 'NO', 'REAGENDA', 'OUT', 'SIN RESPUESTA'].includes(stuff)
}

export type TagWithText = {
  tag: Tag
  text: string
}

export interface InteractionMeta {
  header: string
  value: string | TagWithText
}

export type SchedulingSystem = 'Dentalink' | 'Medilink' | 'Otro'

export interface Appointment {
  id?: string
  rut: string
  patientName: string
  datetime: Date
  url?: string
  schedulingSystem?: SchedulingSystem
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
export type PatientId = Interaction['patientId']
export type AlertId = Alert['id']
export type CommentId = Comment['id']
