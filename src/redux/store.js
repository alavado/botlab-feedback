import { combineReducers, createStore, applyMiddleware } from 'redux'
import { save, load } from 'redux-localstorage-simple'
import rootReducer from './ducks/index'

// los que se guardan en el localStorage
const states = ['opciones']

const createStoreWithMiddleware = applyMiddleware(save({ states }))(createStore)

const store = createStoreWithMiddleware(combineReducers(rootReducer), load({ states }))

export default store