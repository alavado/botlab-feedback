import { combineReducers, createStore } from 'redux'
import rootReducer from './ducks/index'

const store = createStore(combineReducers(rootReducer))

export default store