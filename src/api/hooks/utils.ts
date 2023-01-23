import axios from 'axios'
import { parse, parseISO, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import store from '../../redux/store'

export const get = async (url: string) => {
  const { login }: any = store.getState()
  const { token } = login
  return axios.get(url, { headers: { 'Api-Token': token } })
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