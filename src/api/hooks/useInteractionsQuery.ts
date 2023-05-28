import { UseQueryResult, useQuery } from 'react-query'
import { Interaction, ServiceId } from '../types/types'
import { AnswersAPIResponse, AnswersAPIResponseRow } from '../types/responses'
import { API_ROOT, get, parseAPIDate } from './utils'
import { addHours, format, parseISO } from 'date-fns'

const useInteractionsQuery = ({
  serviceId,
  startDate,
  endDate,
}: {
  serviceId: ServiceId | undefined
  startDate: Date
  endDate: Date
}): UseQueryResult<Interaction[], unknown> => {
  const startDateString = format(startDate, 'yyyy-MM-dd')
  const endDateString = format(endDate, 'yyyy-MM-dd')
  const url = `${API_ROOT}/answers/${serviceId}?fecha_inicio=${startDateString}%2000%3A00&fecha_termino=${endDateString}%2023%3A59`

  return useQuery<Interaction[], any, any>(
    ['interactions', serviceId, startDateString, endDateString],
    async () => {
      if (!serviceId) {
        return []
      }
      const { data }: { data: AnswersAPIResponse } = await get(url)
      return data.data.map((answer: AnswersAPIResponseRow): Interaction => {
        const nAppointments = Number(answer.n_appointments || 1)
        return nAppointments === 1
          ? answerSingleAppointmentToInteraction(answer, serviceId)
          : answerSingleAppointmentToInteraction(answer, serviceId)
      })
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 120_000,
    }
  )
}

const answerSingleAppointmentToInteraction = (
  appointment: AnswersAPIResponseRow,
  serviceId: ServiceId
): Interaction => {
  return {
    start: addHours(
      parseISO(appointment.start),
      Number(process.env.REACT_APP_UTC_OFFSET)
    ),
    patientId: appointment.user_id,
    serviceId,
    branch: appointment.sucursal_name as string | undefined,
    phone: appointment.phone,
    appointments: [
      {
        datetime: parseAPIDate(
          appointment.date,
          appointment.time,
          appointment.start
        ),
        patientName: appointment.name as string,
        rut: appointment.rut as string,
        id: appointment.id_cita as string,
        url: (appointment.dentalink_link || appointment.medilink_link) as
          | string
          | undefined,
      },
    ],
    meta: Object.keys(appointment).map((header) => ({
      header,
      value: appointment[header],
    })),
  }
}

export default useInteractionsQuery
