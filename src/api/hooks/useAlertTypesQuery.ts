import { useQuery, UseQueryResult } from 'react-query'
import { AlertType } from '../types/servicio'

const alertNames = [
  'Número equivocado',
  'Paciente tiene pregunta o comentario',
  'Paciente reagenda post confirmación',
  'Paciente cancela post confirmación',
  'Paciente se arrepiente de cancelar su hora',
  'Mensaje post encuesta',
  'Indica fallecimiento',
  'Paciente quiere reagendar',
]

const useAlertTypesQuery = (): UseQueryResult<AlertType[], unknown> => {
  return useQuery<AlertType[], any, any>('alertTypes', async () => {
    return alertNames.map((name) => ({
      id: name,
      name,
    }))
  })
}

export default useAlertTypesQuery
