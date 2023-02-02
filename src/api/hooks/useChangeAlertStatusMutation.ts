import { useMutation, UseMutationResult } from 'react-query'
import { patch, API_ROOT } from './utils'

const useChangeAlertStatusMutation = ({
  alertId,
  solved,
}: {
  alertId: number
  solved: boolean
}): UseMutationResult<unknown, unknown> => {
  const url = `${API_ROOT}/alerts/${alertId}`
  return useMutation<any, any, any>(async () => {
    const { data } = await patch(url, { dismissed: solved })
    return data
  })
}

export default useChangeAlertStatusMutation
