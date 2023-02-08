import {
  addDays,
  addHours,
  format,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { History } from 'history'
import _ from 'lodash'
import { useCallback } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../redux/ducks'
import { AlertsAPIResponse } from '../types/responses'
import { Alert } from '../types/types'
import useAlertTypesQuery from './useAlertTypesQuery'
import useBranchesQuery from './useBranchesQuery'
import useServicesQuery from './useServicesQuery'
import { get, API_ROOT } from './utils'
import logo from '../../assets/images/logo_cuadrado_notificaciones.png'
import useAnalytics from '../../hooks/useAnalytics'

const alertsSinceDays = 3

export interface ActiveAlerts {
  pending: Alert[]
  solved: Alert[]
}

const useActiveAlertsQuery = (): UseQueryResult<ActiveAlerts, unknown> => {
  const {
    hiddenAlertTypes,
    hiddenBranches,
    hiddenServices,
    notificationsEnabled,
  } = useSelector((state: RootState) => state.alerts)
  const { data: alertTypes } = useAlertTypesQuery()
  const { data: services } = useServicesQuery()
  const { data: branches } = useBranchesQuery()
  const history = useHistory()
  const track = useAnalytics()

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
      const allAlerts = data.data.map((alert): Alert => {
        const typeName = alertTypes?.find((t) => t.id === alert.message)?.name
        const serviceName = services?.find((t) => t.id === alert.poll_id)?.name
        const patientName =
          alert.meta.name ||
          alert.meta.patient_name ||
          alert.meta.patient_name_1 ||
          alert.meta.Nombre ||
          alert.meta['Nombre 1']
        const branchId = alert.meta.sucursal_name || alert.meta.sucursal_name_1
        const branchName = branches?.find((b) => b.id === branchId)?.name
        const timestamp = addHours(
          parseISO(alert.utc_timestamp),
          Number(process.env.REACT_APP_UTC_OFFSET as string)
        )
        return {
          id: alert.id,
          typeId: alert.message,
          typeName,
          solved: alert.dismissed,
          solvedBy: alert.dismissal_by_username,
          timestamp,
          formattedTimestamp: formatAlertTimestamp(timestamp),
          serviceId: alert.poll_id,
          serviceName,
          patientId: alert.user_id,
          patientName,
          branchId,
          branchName,
        }
      })
      const alertsPerPatient = _.groupBy(allAlerts, (alert) => [
        alert.patientId,
        alert.serviceId,
      ])
      const onlyLatestAlertPerPatient = _.values(alertsPerPatient).map(
        (arr) => arr.slice(-1)[0]
      )
      return onlyLatestAlertPerPatient
    },
    {
      refetchInterval: 10_000,
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
          emitNotification(history, newAlerts[0], track)
        }
        return !!oldData && newAlerts.length === 0
      },
    }
  )
}

const formatAlertTimestamp = (timestamp: Date): string => {
  if (isToday(timestamp)) {
    return 'hoy, ' + format(timestamp, 'HH:mm')
  }
  if (isYesterday(timestamp)) {
    return 'ayer, ' + format(timestamp, 'HH:mm')
  }
  return format(timestamp, 'iiii dd', { locale: es })
}

const emitNotification = (history: History, alert: Alert, track: any) => {
  let notification = new Notification('Feedback', {
    body: alert.typeName,
    requireInteraction: true,
    silent: false,
    icon: logo,
  })
  notification.onclick = () => {
    history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
    track('Feedback', 'Alerts', 'notificationClick')
    window.focus()
  }
}

export default useActiveAlertsQuery
