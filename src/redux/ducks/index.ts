import login from './login'
import encuestas from './encuestas'
import respuestas from './respuestas'
import opciones from './opciones'
import busqueda from './busqueda'
import scrambler from './scrambler'
import enviador from './enviador'
import cero from './cero'
import reacciones from './reacciones'
import novedades from './novedades'
import alertas from './alertas'
import servicio from './servicio'
import tutoriales from './tutoriales'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  login,
  encuestas,
  respuestas,
  opciones,
  busqueda,
  scrambler,
  enviador,
  cero,
  reacciones,
  novedades,
  alertas,
  servicio,
  tutoriales,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer