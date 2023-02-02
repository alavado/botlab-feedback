import { addDays, format, isToday, isYesterday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import _ from 'lodash'
import { useCallback } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { AlertsAPIResponse } from '../types/responses'
import { Alert } from '../types/servicio'
import useAlertTypesQuery from './useAlertTypesQuery'
import useBranchesQuery from './useBranchesQuery'
import useServicesQuery from './useServicesQuery'
import { get, API_ROOT } from './utils'

const alertsSinceDays = 3

const useActiveAlertsQuery = (): UseQueryResult<
  { pending: Alert[]; solved: Alert[] },
  unknown
> => {
  const {
    hiddenAlertTypes,
    hiddenBranches,
    hiddenServices,
    notificationsEnabled,
  } = useSelector((state: RootState) => state.alerts)
  const { data: alertTypes } = useAlertTypesQuery()
  const { data: services } = useServicesQuery()
  const { data: branches } = useBranchesQuery()

  const isAlertActive = useCallback(
    (alert: Alert) => {
      return (
        !_.includes(hiddenAlertTypes, alert.typeId) &&
        !_.includes(hiddenBranches, alert.branchId) &&
        !_.includes(hiddenServices, alert.serviceId) &&
        alertTypes?.some((t) => t.id === alert.typeId)
      )
    },
    [hiddenAlertTypes, hiddenBranches, hiddenServices, alertTypes]
  )

  const today = format(new Date(), 'yyyy-MM-dd')
  const daysAgo = format(addDays(new Date(), -alertsSinceDays), 'yyyy-MM-dd')
  const url = `${API_ROOT}/polls/alerts?start_date=${daysAgo}&end_date=${today}`

  return useQuery<Alert[], any, any>(
    'alerts',
    async () => {
      const { data }: { data: AlertsAPIResponse } = await get(url)
      return data.data.map((alert): Alert => {
        const typeName = alertTypes?.find((t) => t.id === alert.message)?.name
        const serviceName = services?.find((t) => t.id === alert.poll_id)?.name
        const patientName =
          alert.meta.name ||
          alert.meta.patient_name ||
          alert.meta.patient_name_1
        const branchId = alert.meta.sucursal_name || alert.meta.sucursal_name_1
        const branchName = branches?.find((b) => b.id === branchId)?.name
        return {
          id: alert.id,
          typeId: alert.message,
          typeName,
          solved: alert.dismissed,
          solvedBy: alert.dismissal_by,
          timestamp: parseISO(alert.utc_timestamp),
          formattedTimestamp: formatAlertTimestamp(alert.utc_timestamp),
          serviceId: alert.poll_id,
          serviceName,
          patientId: alert.user_id,
          patientName,
          branchId,
          branchName,
        }
      })
    },
    {
      refetchInterval: 30_000,
      refetchIntervalInBackground: true,
      enabled: !!alertTypes && !!services,
      select: (data) => {
        const activeAlerts = _.reverse(
          _.sortBy(data.filter(isAlertActive), 'timestamp')
        )
        return {
          pending: activeAlerts.filter((a) => !a.solved),
          solved: activeAlerts.filter((a) => a.solved),
        }
      },
      isDataEqual: (oldData, newData) => {
        const newActiveAlerts = newData?.filter(
          (alert) => isAlertActive(alert) && !alert.solved
        )
        const oldActiveAlerts = oldData?.filter(
          (alert) => isAlertActive(alert) && !alert.solved
        )
        const newAlerts = _.differenceBy(
          newActiveAlerts,
          oldActiveAlerts || [],
          (x) => x.id
        )
        if (oldActiveAlerts && newAlerts.length > 0 && notificationsEnabled) {
          emitNotification()
        }
        return !!oldData && newAlerts.length === 0
      },
    }
  )
}

const formatAlertTimestamp = (timestamp: string): string => {
  const dateTime = parseISO(timestamp)
  if (isToday(dateTime)) {
    return 'hoy, ' + format(parseISO(timestamp), 'HH:mm')
  }
  if (isYesterday(dateTime)) {
    return 'ayer, ' + format(parseISO(timestamp), 'HH:mm')
  }
  return format(parseISO(timestamp), 'iiii dd', { locale: es })
}

const emitNotification = () => {
  let notification = new Notification('Feedback', {
    body: `Feedback`,
    requireInteraction: true,
    silent: false,
  })
  notification.onclick = () => {
    window.focus()
  }
}

export default useActiveAlertsQuery
