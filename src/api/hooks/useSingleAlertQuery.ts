import { formatISO, isSameDay, parseISO } from 'date-fns'
import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import {
  chatAPIConversation,
  chatAPIResponse,
  metaTarget,
} from '../types/responses'
import {
  Appointment,
  Interaction,
  Message,
  PatientId,
  SchedulingSystem,
  ServiceId,
} from '../types/types'
import { get, API_ROOT, parseAPIDate } from './utils'
import useChatQuery from './useChatQuery'

const useSingleAlertQuery = (
  serviceId: string,
  patientId: string,
  alertId: string
): UseQueryResult<any, any> => {
  return useQuery<any, any, any>(
    ['alert', alertId],
    async () => {
      const { data: alertData } = await get(`${API_ROOT}/alerts/${alertId}`)
      const { data: chatData }: { data: chatAPIResponse } = await get(
        `${API_ROOT}/chat/${serviceId}/${patientId}`
      )
      return {
        alertData,
        chatData,
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  )
}

export default useSingleAlertQuery
