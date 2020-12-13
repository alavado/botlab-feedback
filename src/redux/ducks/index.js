import login from './login'
import encuestas from './encuestas'
import respuestas from './respuestas'
import opciones from './opciones'
import busqueda from './busqueda'
import { combineReducers } from 'redux'

export default combineReducers({
  login,
  encuestas,
  respuestas,
  opciones,
  busqueda
})