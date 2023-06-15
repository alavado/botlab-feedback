import { UseQueryResult, useQuery } from 'react-query'
import { Interaction, ServiceId, Tag, TagWithText } from '../types/domain'
import {
  APIMetaValue,
  APITag,
  AnswersAPIResponse,
  AnswersAPIResponseRow,
} from '../types/responses'
import { API_ROOT, get, parseAPIDate } from './utils'
import { addHours, format, parseISO } from 'date-fns'
import _ from 'lodash'
import { useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

const useInteractionsQuery = (): UseQueryResult<Interaction[], unknown> => {
  const { range } = useSelector((state: RootState) => state.interactions)
  const startDateString = format(range.start, 'yyyy-MM-dd')
  const endDateString = format(range.end, 'yyyy-MM-dd')
  const {
    params: { serviceId },
  }: any = useRouteMatch()
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
    id: {
      patientId: appointment.user_id,
      serviceId,
      start: addHours(
        parseISO(appointment.start),
        Number(process.env.REACT_APP_UTC_OFFSET)
      ),
    },
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
    extraData: Object.keys(appointment).map((header) => ({
      header,
      value: processMeta(appointment[header]),
    })),
    tags: [],
  }
}

const processMeta = (meta: APIMetaValue): string | TagWithText => {
  if (!_.isString(meta) && !_.isNumber(meta) && meta) {
    return {
      tag: mapTag(meta.tag),
      text: meta.text,
    }
  }
  return meta + ''
}

const mapTag = (tag: APITag): Tag => {
  switch (tag) {
    case 'PHONE:YES':
      return 'YES'
    case 'PHONE:NO':
      return 'NO'
  }
  return tag
}

export default useInteractionsQuery
