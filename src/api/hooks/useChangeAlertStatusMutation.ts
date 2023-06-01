import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { Alert, AlertId, PatientId, ServiceId } from '../types/domain'
import { patch, API_ROOT } from './utils'

const useChangeAlertStatusMutation = ({
  alertId,
  serviceId,
  patientId,
  solved,
}: {
  alertId: AlertId
  serviceId: ServiceId
  patientId: PatientId
  solved: boolean
}): UseMutationResult<unknown, unknown> => {
  const url = `${API_ROOT}/alerts/${alertId}`
  const queryClient = useQueryClient()
  return useMutation<any, any, any>(
    async () => {
      const { data } = await patch(url, { dismissed: solved })
      return data
    },
    {
      onMutate: async () => {
        // refactorear esto
        await queryClient.cancelQueries('interaction')
        await queryClient.cancelQueries('alerts')
        const alertsBeforeMutation = queryClient.getQueryData(
          'alerts'
        ) as Alert[]
        const mutatedAlert = alertsBeforeMutation.find((a) => a.id === alertId)
        if (mutatedAlert) {
          mutatedAlert.solved = solved
        }
        const alertsWithMutatedAlert = [
          ...alertsBeforeMutation.filter((a) => a.id !== alertId),
          mutatedAlert,
        ]
        queryClient.setQueryData('alerts', alertsWithMutatedAlert)
        const patientAlertsBeforeMutation = queryClient.getQueryData([
          'alerts',
          serviceId,
          patientId,
        ]) as Alert[]
        const patientMutatedAlert = patientAlertsBeforeMutation.find(
          (a) => a.id === alertId
        )
        if (patientMutatedAlert) {
          patientMutatedAlert.solved = solved
        }
        const patientAlertsWithMutatedAlert = [
          ...patientAlertsBeforeMutation.filter((a) => a.id !== alertId),
          patientMutatedAlert,
        ]
        queryClient.setQueryData(
          ['alerts', serviceId, patientId],
          patientAlertsWithMutatedAlert
        )
        return { alertsBeforeMutation, patientAlertsBeforeMutation }
      },
      onError: (err, nuevaAlerta, context: any) => {
        queryClient.setQueryData('alerts', context.alertsBeforeMutation)
        queryClient.setQueryData(
          ['alerts', serviceId, patientId],
          context.patientAlertsBeforeMutation
        )
      },
    }
  )
}

export default useChangeAlertStatusMutation
