import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { AlertType } from '../types/domain'

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
    name: 'Se arrepiente de cancelar hora',
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
  {
    id: 'Derivación de examen o procedimiento',
    name: 'Derivación',
  },
]

const useAlertTypesQuery = (): UseQueryResult<AlertType[], unknown> => {
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  return useQuery<AlertType[], any, any>('alertTypes', async () => {
    let filteredAlertTypes = alertTypes
    if (nombreUsuario !== 'NucleoSalud' && nombreUsuario !== 'Sanasalud') {
      filteredAlertTypes = filteredAlertTypes.filter(
        (t) => t.id !== 'Derivación de examen o procedimiento'
      )
    }
    return _.sortBy(filteredAlertTypes, 'name')
  })
}

export default useAlertTypesQuery
