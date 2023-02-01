import { Alerta } from './types/servicio'
import { format, parseISO, addDays } from 'date-fns'
import { useQuery, useQueryClient } from 'react-query'
import { AlertsAPIResponse } from './types/responses'
import { get } from './hooks/utils'

const API_ROOT = process.env.REACT_APP_API_ROOT

const obtenerAlertas = async (diasAtras: number = 3): Promise<Alerta[]> => {
  const hoy = format(new Date(), 'yyyy-MM-dd')
  const hace7Dias = format(addDays(new Date(), -diasAtras), 'yyyy-MM-dd')
  const response: AlertsAPIResponse = (
    await get(
      `${API_ROOT}/polls/alerts?start_date=${hace7Dias}&end_date=${hoy}`
    )
  ).data
  return response.data.map(
    (alertaAPI: any): Alerta => ({
      timestamp: parseISO(alertaAPI.utc_timestamp),
      texto: alertaAPI.message,
      resuelta: alertaAPI.dismissed,
      resueltaPor: alertaAPI.dismissal_by_username,
      id: alertaAPI.id,
      idServicio: alertaAPI.poll_id,
      idUsuario: alertaAPI.user_id,
    })
  )
}

export const useAlertasQuery = () => {
  const queryClient = useQueryClient()

  return useQuery(
    'alertas',
    async () => {
      const alertas = await obtenerAlertas()
      alertas.forEach((alerta) => {
        const queryKey = ['alertas', alerta.idServicio, alerta.idUsuario]
        const alertasPrevias: Alerta[] | undefined =
          queryClient.getQueryData(queryKey)
        queryClient.setQueryData(
          queryKey,
          alertasPrevias ? [...alertasPrevias, alerta] : [alerta]
        )
      })
      return alertas
    },
    {
      refetchInterval: 30_000,
      refetchOnWindowFocus: false,
    }
  )
}
