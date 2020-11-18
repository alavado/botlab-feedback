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
  return axios.get(`${API_ROOT}/answer_headers/${idEncuesta}`, {
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

export const headers = () => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/polls_headers`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const chat = (idEncuesta, idUsuario) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/chat/${idEncuesta}/${idUsuario}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const busqueda = termino => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/answers_es?query=${termino}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const exportarRespuestas = (idEncuesta, fechaInicio, fechaTermino) => {
  const fi = format(fechaInicio, 'yyyy-MM-dd')
  const ft = format(fechaTermino, 'yyyy-MM-dd')
  const token = store.getState().login.token
  const url = `${API_ROOT}/report/${idEncuesta}?type=tag&fecha_inicio=${fi}%2000%3A00&fecha_termino=${ft}%2023%3A59`
  return axios.get(url, { headers: { 'Api-Token': token, 'Api-UTC-Offset': -180 }, responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'feedback.csv')
      document.body.appendChild(link)
      link.click()
    })
}