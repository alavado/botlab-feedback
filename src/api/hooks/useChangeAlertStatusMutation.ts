import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { Alert } from '../types/types'
import { patch, API_ROOT } from './utils'

const useChangeAlertStatusMutation = ({
  alertId,
  solved,
}: {
  alertId: number
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
        queryClient.setQueryData('alerts', () => alertsWithMutatedAlert)
        return { alertsBeforeMutation }
      },
      onError: (err, nuevaAlerta, context: any) => {
        queryClient.setQueryData('alerts', context.alertsBeforeMutation)
      },
    }
  )
}

export default useChangeAlertStatusMutation
