import axios from 'axios'
import { API_ROOT } from './config'
import { format } from 'date-fns'
import store from '../redux/store'

export const login = (username, password) => {
  const auth = { username, password }
  return axios.get(`${API_ROOT}/token`, { auth })
}

export const headersRespuestas = idEncuesta => {
  const token = store.getState().login.token
  return axios.get(`https://api.dev.botlab.cl/answer_headers/${idEncuesta}`, {
    headers: { 'Api-Token': token }
  })
}

export const respuestas = (idEncuesta, fechaInicio, fechaTermino) => {
  const token = store.getState().login.token
  const inicio = format(fechaInicio, 'yyyy-MM-dd')
  const termino = format(fechaTermino, 'yyyy-MM-dd')
  const url = `${API_ROOT}/answers/${idEncuesta}?fecha_inicio=${inicio}%2000%3A00&fecha_termino=${termino}%2023%3A59`
  return axios.get(url, { headers: { 'Api-Token': token } })
}