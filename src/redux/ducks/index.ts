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
import { combineReducers } from 'redux'

import search from './search'
import alerts from './alerts'
import comments from './comments'
import dashboard from './dashboard'
import interactions from './interactions'

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
  search,
  alerts,
  comments,
  dashboard,
  interactions,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
