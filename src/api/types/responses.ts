interface chatAPIUserMessage {
  answer_id: number
  message: string
  question_id: number
  tag: string
  timestamp: string
  type: 'user'
}

interface chatAPIBotMessage {
  timestamp: string
  message: string
  type: 'bot'
}

export type chatAPIMessage = chatAPIUserMessage | chatAPIBotMessage

export interface chatAPIConversation {
  start: string
  context: {
    target:
      | 'rut'
      | 'name'
      | 'patient_name_1'
      | 'date'
      | 'time'
      | 'sucursal_name'
      | 'dentalink_link'
      | 'medilink_link'
    title: string
    value: string
  }[]
  messages: chatAPIMessage[]
  reactions: [any]
  tags: [
    {
      question: string
      question_id: string
      tag: string
    }
  ]
}

export interface chatAPIResponse {
  status: string
  data: {
    bot: {
      name: string
      phone: string
    }
    conversations: chatAPIConversation[]
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

export interface reactionsAPIResponse {
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

export interface alertasAPIResponse {
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
