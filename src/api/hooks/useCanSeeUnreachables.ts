import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

const forbiddenUsers = ['sanasalud', 'sanasalud_cero', 'norden', 'norden_cero']

function useCanSeeUnreachables() {
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  return nombreUsuario && !forbiddenUsers.includes(nombreUsuario.toLowerCase())
}

export default useCanSeeUnreachables
