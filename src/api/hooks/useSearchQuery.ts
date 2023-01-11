import { addHours } from 'date-fns'
import { parseISO } from 'date-fns/esm'
import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import {
  SearchAPIMultiAppointment,
  SearchAPISingleAppointment,
} from '../types/responses'
import { Appointment, Interaction } from '../types/servicio'
import { get, parseAPIDate } from './utils'

const searchSingleAppointmentToInteraction = (
  appointment: SearchAPISingleAppointment
): Interaction => {
  return {
    start: addHours(
      parseISO(appointment.start),
      Number(process.env.REACT_APP_UTC_OFFSET)
    ),
    userId: appointment.user_id,
    pollId: appointment.poll_id,
    branch: appointment.sucursal_name,
    phone: appointment.phone,
    appointments: [
      {
        datetime: parseAPIDate(
          appointment.date,
          appointment.time,
          appointment.start
        ),
        patientName: appointment.name,
        rut: appointment.rut,
        id: appointment.id_cita,
        url: appointment.dentalink_link || appointment.medilink_link,
      },
    ],
  }
}

const searchMultiAppointmentToInteraction = (
  appointment: SearchAPIMultiAppointment
): Interaction => {
  return {
    start: addHours(
      parseISO(appointment.start),
      Number(process.env.REACT_APP_UTC_OFFSET)
    ),
    userId: appointment.user_id,
    pollId: appointment.poll_id,
    branch: appointment.sucursal_name_1 || appointment.sucursal_name,
    phone: appointment.phone,
    appointments: Array(Number(appointment.n_appointments))
      .fill(0)
      .map<Appointment>((_, i): Appointment => {
        const index = i + 1
        const appointment_time =
          (appointment[
            `time_${index}` as keyof SearchAPIMultiAppointment
          ] as string) || ''
        return {
          datetime: parseAPIDate(
            appointment.date_1,
            appointment_time,
            appointment.start
          ),
          patientName: appointment[
            `patient_name_${index}` as keyof SearchAPIMultiAppointment
          ] as string,
          rut: appointment[
            `rut_${index}` as keyof SearchAPIMultiAppointment
          ] as string,
          id: appointment[
            `id_cita_${index}` as keyof SearchAPIMultiAppointment
          ] as string,
        }
      }),
  }
}

const useSearchQuery = (
  term: String
): UseQueryResult<Interaction[], unknown> => {
  return useQuery(['search', term], async () => {
    if (!term) {
      return []
    }
    const { data } = await get(`https://api.botlab.cl/answers_es?query=${term}`)
    const interactions = data.data.map((searchResult: any): Interaction => {
      const nAppointments = Number(searchResult.n_appointments || 1)
      return nAppointments > 1
        ? searchMultiAppointmentToInteraction(
            searchResult as SearchAPIMultiAppointment
          )
        : searchSingleAppointmentToInteraction(
            searchResult as SearchAPISingleAppointment
          )
    })
    return _.orderBy(interactions, 'start', 'desc')
  })
}

export default useSearchQuery
