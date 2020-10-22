import { combineReducers, createStore, applyMiddleware } from 'redux'
import { save, load } from 'redux-localstorage-simple'
import rootReducer from './ducks/index'

const createStoreWithMiddleware = applyMiddleware(save({
  states: ['opciones']
}))(createStore)
  
const store = createStoreWithMiddleware(combineReducers(rootReducer), load())

export default store