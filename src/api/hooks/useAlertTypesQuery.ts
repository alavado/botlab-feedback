import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { AlertType } from '../types/servicio'

const alertTypes = [
  {
    id: 'Número equivocado',
    name: 'Número equivocado',
  },
  {
    id: 'Paciente tiene pregunta o comentario',
    name: 'Pregunta o comentario',
  },
  {
    id: 'Paciente reagenda post confirmación',
    name: 'Reagenda post confirmación',
  },
  {
    id: 'Paciente cancela post confirmación',
    name: 'Cancela post confirmación',
  },
  {
    id: 'Paciente se arrepiente de cancelar su hora',
    name: 'Se arrepiente de cancelar su hora',
  },
  {
    id: 'Mensaje post encuesta',
    name: 'Mensaje post interacción',
  },
  {
    id: 'Indica fallecimiento',
    name: 'Indica fallecimiento',
  },
  {
    id: 'Paciente quiere reagendar',
    name: 'Quiere reagendar',
  },
]

const useAlertTypesQuery = (): UseQueryResult<AlertType[], unknown> => {
  return useQuery<AlertType[], any, any>('alertTypes', async () => {
    return _.sortBy(alertTypes, 'name')
  })
}

export default useAlertTypesQuery
