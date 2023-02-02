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
    name: 'Paciente tiene pregunta o comentario',
  },
  {
    id: 'Paciente reagenda post confirmación',
    name: 'Paciente reagenda post confirmación',
  },
  {
    id: 'Paciente cancela post confirmación',
    name: 'Paciente cancela post confirmación',
  },
  {
    id: 'Paciente se arrepiente de cancelar su hora',
    name: 'Paciente se arrepiente de cancelar su hora',
  },
  {
    id: 'Mensaje post encuesta',
    name: 'Mensaje post interacción',
  },
  {
    id: 'Indica fallecimiento',
    name: 'Fallecimiento',
  },
  {
    id: 'Paciente quiere reagendar',
    name: 'Paciente quiere reagendar',
  },
]

const useAlertTypesQuery = (): UseQueryResult<AlertType[], unknown> => {
  return useQuery<AlertType[], any, any>('alertTypes', async () => {
    return _.sortBy(alertTypes, 'name')
  })
}

export default useAlertTypesQuery
