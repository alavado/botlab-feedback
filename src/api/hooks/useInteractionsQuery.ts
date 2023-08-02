import { UseQueryResult, useQuery } from 'react-query'
import { Interaction, ServiceId, Tag, tagPreffix } from '../types/domain'
import {
  APIMetaValue,
  APITag,
  AnswersAPIResponse,
  AnswersAPIResponseRow,
} from '../types/responses'
import {
  API_ROOT,
  get,
  getInteractionTags,
  getStatusFromAnswersResponseRow,
  parseAPIDate,
} from './utils'
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
      return _.sortBy(
        data.data.map((answer: AnswersAPIResponseRow): Interaction => {
          const nAppointments = Number(answer.n_appointments || 1)
          return nAppointments === 1
            ? answerSingleAppointmentToInteraction(answer, serviceId)
            : answerSingleAppointmentToInteraction(answer, serviceId)
        }),
        (i) => i.appointments[0].datetime
      )
    },
    {
      refetchInterval: 60_000,
    }
  )
}

const answerSingleAppointmentToInteraction = (
  apiAppointment: AnswersAPIResponseRow,
  serviceId: ServiceId
): Interaction => {
  const appointment = {
    datetime: parseAPIDate(
      apiAppointment.date,
      apiAppointment.time,
      apiAppointment.start
    ),
    patientName: apiAppointment.name as string,
    rut: apiAppointment.rut as string,
    id: apiAppointment.id_cita as string,
    url: (apiAppointment.dentalink_link || apiAppointment.medilink_link) as
      | string
      | undefined,
    status: getStatusFromAnswersResponseRow(apiAppointment),
  }
  return {
    id: {
      patientId: apiAppointment.user_id,
      serviceId,
      start: addHours(
        parseISO(apiAppointment.start),
        Number(process.env.REACT_APP_UTC_OFFSET)
      ),
    },
    branch: apiAppointment.sucursal_name as string | undefined,
    phone: apiAppointment.phone,
    appointments: [appointment],
    extraData: Object.keys(apiAppointment).map((header) => ({
      header,
      value: processMeta(apiAppointment[header]),
    })),
    tags: getInteractionTags([appointment]),
  }
}

const processMeta = (meta: APIMetaValue): string => {
  if (!_.isString(meta) && !_.isNumber(meta) && meta) {
    return formatTag(meta.tag)
  }
  return meta + ''
}

const formatTag = (tag: APITag): string => {
  switch (tag) {
    case 'PHONE:YES':
      return tagPreffix + 'YES'
    case 'PHONE:NO':
      return tagPreffix + 'NO'
  }
  return tagPreffix + tag
}

export default useInteractionsQuery
