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
import { combineReducers } from 'redux'

import servicio from './servicio'
import interaccion from './interaccion'
import sucursal from './sucursal'

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
  interaccion,
  sucursal
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer