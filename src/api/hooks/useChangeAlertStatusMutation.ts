import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { Alert } from '../types/servicio'
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
        const alertasAntes = queryClient.getQueryData('alerts') as Alert[]
        const nuevaAlerta = alertasAntes.find((a) => a.id === alertId)
        if (nuevaAlerta) {
          nuevaAlerta.solved = solved
        }
        const nuevasAlertas = {
          ...alertasAntes,
          data: [...alertasAntes.filter((a) => a.id !== alertId), nuevaAlerta],
        }
        queryClient.setQueryData('alerts', () => nuevasAlertas)
        return { alertasAntes }
      },
      onError: (err, nuevaAlerta, context) => {
        // queryClient.setQueryData('alerts', context.alertasAntes)
      },
      onSettled: () => {
        queryClient.invalidateQueries('alerts')
      },
    }
  )
}

export default useChangeAlertStatusMutation
