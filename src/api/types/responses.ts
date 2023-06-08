interface ChatAPIUserMessage {
  answer_id: number
  message: string
  question_id: number
  tag: string
  timestamp: string
  type: 'user'
}

interface ChatAPIBotMessage {
  timestamp: string
  message: string
  type: 'bot'
}

export type ChatAPIMessage = ChatAPIUserMessage | ChatAPIBotMessage

export type MetaTarget =
  | 'id_cita'
  | 'rut'
  | 'name'
  | 'date'
  | 'time'
  | 'sucursal_name'
  | 'dentalink_link'
  | 'medilink_link'
  | 'n_appointments'
  | 'sucursal_name_1'
  | 'id_cita_1'
  | 'rut_1'
  | 'patient_name_1'
  | 'date_1'
  | 'time_1'
  | 'id_cita_2'
  | 'rut_2'
  | 'patient_name_2'
  | 'date_2'
  | 'time_2'
  | 'id_cita_3'
  | 'rut_3'
  | 'patient_name_3'
  | 'date_3'
  | 'time_3'
  | 'id_cita_4'
  | 'rut_4'
  | 'patient_name_4'
  | 'date_4'
  | 'time_4'
  | 'id_cita_5'
  | 'rut_5'
  | 'patient_name_5'
  | 'date_5'
  | 'time_5'

export interface ChatAPIConversationContextField {
  target: MetaTarget
  title: string
  value: string
}

export interface ChatAPIConversation {
  start: string
  context: ChatAPIConversationContextField[]
  messages: ChatAPIMessage[]
  reactions: [any]
  tags: [
    {
      question: string
      question_id: string
      tag: string
    }
  ]
  is_unreachable: { whatsapp: boolean }
}

export interface ChatAPIResponse {
  status: string
  data: {
    bot: {
      name: string
      phone: string
    }
    conversations: ChatAPIConversation[]
    user: {
      id: number
      outsider: boolean
      phone: string
      timestamp: string
    }
    _appointment_data: any
    _appointment_metas: any[]
  }
}

export interface ReactionsAPIResponse {
  status: string
  data: [
    {
      created_at: string
      id: number
      reaction_emoji: string
      reaction_text: string
    }
  ]
}

export interface AlertsAPIResponse {
  status: string
  data: [
    {
      dismissal_by?: string
      dismissal_by_username?: string
      dismissal_updated_at?: string
      dismissed: boolean
      id: number
      message: string
      meta: any
      poll_id: number
      timestamp_first_effective_interaction: string
      timestamp_poll_started: string
      user_id: number
      utc_timestamp: string
    }
  ]
}

export interface SearchAPISingleAppointment {
  date: string
  doctor_name: string
  id_cita: string
  name: string
  phone: string
  poll_id: number
  rut: string
  service_name: string
  start: string
  started: string
  time: string
  user_id: number
  sucursal_name: string
  dentalink_link?: string
  medilink_link?: string
  dentalink_link_1?: string
  medilink_link_1?: string
}

export interface SearchAPIMultiAppointment {
  date_1: string
  id_cita_1: string
  id_cita_2: string
  id_cita_3: string
  id_cita_4: string
  id_cita_5: string
  n_appointments: string
  patient_name_1: string
  patient_name_2: string
  patient_name_3: string
  patient_name_4: string
  patient_name_5: string
  phone: string
  poll_id: number
  rut_1: string
  rut_2: string
  rut_3: string
  rut_4: string
  rut_5: string
  start: string
  started: string
  sucursal_name_1?: string
  sucursal_name?: string
  time_1: string
  time_2: string
  time_3: string
  time_4: string
  time_5: string
  user_id: number
}

export interface AnswerMediaAPIResponse {
  status: string
  data: {
    url: string
    content_type: string
  }
}

export type TagType = 'META' | 'YESNO' | 'INTERNAL' | 'RANGE' | 'OPEN'

export interface PollsHeadersAPIResponse {
  status: string
  data: [
    {
      id: number
      name: string
      archived: boolean
      enabled: boolean
      headers: [
        {
          name: string
          display_name: string
          type: TagType
        }
      ]
    }
  ]
}

interface FixedAnswersAPIResponseKeys {
  user_id: number
  started: string
  phone: string
  start: string
  date: string
  time: string
  latest_alert: unknown
  is_unreachable: {
    whatsapp: boolean
  }
  reactions: [
    {
      id: number
      reaction_emoji: string
      reaction_text: string
      created_at: string
    }
  ]
}

export type APITag =
  | 'YES'
  | 'NO'
  | 'REAGENDA'
  | 'OUT'
  | 'PHONE:YES'
  | 'PHONE:NO'

export type APITagWithText = {
  tag: APITag
  text: string
}

export type APIMetaValue = string | number | APITagWithText

export type AnswersAPIResponseRow = FixedAnswersAPIResponseKeys & {
  [key: string]: APIMetaValue
}

export type AnswersAPIResponse = {
  status: string
  data: [AnswersAPIResponseRow]
}
