import axios from 'axios'
import { parse, parseISO, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import store from '../../redux/store'
import {
  Appointment,
  AppointmentStatus,
  InteractionStatus,
} from '../types/domain'
import {
  APITagWithText,
  AnswersAPIResponseRow,
  ChatAPIConversation,
  SearchAPIMultiAppointment,
  SearchAPISingleAppointment,
  isAPITagWithText,
} from '../types/responses'

export const API_ROOT = process.env.REACT_APP_API_ROOT

export const get = async (url: string) => {
  const { login }: any = store.getState()
  const { token } = login
  return axios.get(url, { headers: { authorization: `Bearer ${token}` } })
}

export const post = async (url: string, params: any) => {
  const { login }: any = store.getState()
  const { token } = login
  return axios.post(url, params, {
    headers: { authorization: `Bearer ${token}` },
  })
}

export const patch = async (url: string, params: any) => {
  const { login }: any = store.getState()
  const { token } = login
  return axios.patch(url, params, {
    headers: { authorization: `Bearer ${token}` },
  })
}

export const del = async (url: string, data: any) => {
  const { login }: any = store.getState()
  const { token } = login
  return axios({
    url,
    method: 'delete',
    data,
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export const parseAPIDate = (
  appointmentDate: string,
  appointmentTime: string,
  referenceISODate: string
) => {
  if (!appointmentDate) {
    return startOfDay(parseISO(referenceISODate))
  }
  if (!appointmentTime) {
    return parse(
      appointmentDate,
      "d 'de' MMMM",
      startOfDay(parseISO(referenceISODate)),
      { locale: es }
    )
  }
  return parse(
    `${appointmentDate} ${appointmentTime}`,
    appointmentTime.includes('M') ? "d 'de' MMMM h:m a" : "d 'de' MMMM H:m",
    parseISO(referenceISODate),
    { locale: es }
  )
}

export const getStatusFromAnswersResponseRow = (
  appointment: AnswersAPIResponseRow
): AppointmentStatus => {
  const firstTagKey = Object.keys(appointment).find((key) =>
    isAPITagWithText(appointment[key])
  )
  const firstTag = firstTagKey && appointment[firstTagKey]
  if (firstTag) {
    const firstTagValue = firstTag as APITagWithText
    switch (firstTagValue.tag) {
      case '':
      case 'UNREACHABLE':
        return 'SCHEDULED'
      case 'YES':
      case 'PHONE:YES':
        return 'CONFIRMED'
      case 'PHONE:NO':
      case 'NO':
        return 'CANCELLED'
      case 'REAGENDA':
        return 'RESCHEDULED'
      default:
        return 'OTHER'
    }
  }
  return 'SCHEDULED'
}

export const getStatusFromChatConversation = (
  conversation: ChatAPIConversation
): AppointmentStatus => {
  return 'OTHER'
}

export const getStatusFromSearchRow = (
  appointment: SearchAPISingleAppointment | SearchAPIMultiAppointment
): AppointmentStatus => {
  return 'OTHER'
}

export const getInteractionStatus = (
  appointments: Appointment[]
): InteractionStatus => {
  if (appointments.some((a) => a.status !== 'SCHEDULED')) {
    if (appointments.some((a) => a.status === 'CONFIRMED')) {
      return 'CONFIRMED_WHATSAPP'
    }
    if (appointments.some((a) => a.status === 'CANCELLED')) {
      return 'CANCELLED_WHATSAPP'
    }
    if (appointments.some((a) => a.status === 'RESCHEDULED')) {
      return 'RESCHEDULED_WHATSAPP'
    }
    if (appointments.some((a) => a.status === 'OTHER')) {
      return 'OTHER'
    }
  }
  return 'UNANSWERED_WHATSAPP'
}

export const normalizeString = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toLowerCase()
