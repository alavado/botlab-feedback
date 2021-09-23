import login from './login'
import encuestas from './encuestas'
import respuestas from './respuestas'
import opciones from './opciones'
import busqueda from './busqueda'
import alertas from './alertas'
import scrambler from './scrambler'
import enviador from './enviador'
import { combineReducers } from 'redux'

export default combineReducers({
  login,
  encuestas,
  respuestas,
  opciones,
  busqueda,
  alertas,
  scrambler,
  enviador
})