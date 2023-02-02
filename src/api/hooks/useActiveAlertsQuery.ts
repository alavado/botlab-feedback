import { addDays, format, parseISO } from 'date-fns'
import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { AlertsAPIResponse } from '../types/responses'
import { Alert } from '../types/servicio'
import { get, API_ROOT } from './utils'

const alertsSinceDays = 3

const useActiveAlertsQuery = ({
  solved,
}: {
  solved: boolean
}): UseQueryResult<Alert[], unknown> => {
  const {
    hiddenAlertTypes,
    hiddenBranches,
    hiddenServices,
    notificationsEnabled,
  } = useSelector((state: RootState) => state.alerts)

  const isAlertActive = (alert: Alert) =>
    alert.solved === solved &&
    !_.includes(hiddenAlertTypes, alert.typeId) &&
    !_.includes(hiddenBranches, alert.branchId) &&
    !_.includes(hiddenServices, alert.serviceId)

  const today = format(new Date(), 'yyyy-MM-dd')
  const daysAgo = format(addDays(new Date(), -alertsSinceDays), 'yyyy-MM-dd')
  const url = `${API_ROOT}/polls/alerts?start_date=${daysAgo}&end_date=${today}`

  return useQuery<Alert[], any, any>(
    'alerts',
    async () => {
      const { data }: { data: AlertsAPIResponse } = await get(url)
      return data.data.map(
        (alert): Alert => ({
          id: alert.id,
          typeId: alert.message,
          solved: alert.dismissed,
          solvedBy: alert.dismissal_by,
          timestamp: parseISO(alert.utc_timestamp),
          serviceId: Number(alert.poll_id),
          patientId: Number(alert.user_id),
          branchId: alert.meta.sucursal_name || alert.meta.sucursal_name_1,
        })
      )
    },
    {
      refetchInterval: 30_000,
      select: (data) =>
        _.reverse(_.sortBy(data.filter(isAlertActive), 'timestamp')),
      isDataEqual: (oldData, newData) => {
        const oldActiveAlerts = oldData?.filter(isAlertActive)
        const newActiveAlerts = newData?.filter(isAlertActive)
        const newAlerts = _.differenceBy(
          oldActiveAlerts,
          newActiveAlerts,
          (x) => x.id
        )
        if (newAlerts.length > 0 && notificationsEnabled) {
          emitNotification()
        }
        console.log({ oldActiveAlerts, newActiveAlerts, newAlerts })
        return newAlerts.length > 0
      },
    }
  )
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
