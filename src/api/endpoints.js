import axios from 'axios'
import store from '../redux/store'
import { format } from 'date-fns'
import { TIPO_EXPORTACION_RESUMEN } from '../helpers/exportar'

const API_ROOT = process.env.REACT_APP_API_ROOT

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
  const url = `${API_ROOT}/chat0/${idEncuesta}/${idUsuario}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const chat2 = (idEncuesta, idUsuario) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/chat/${idEncuesta}/${idUsuario}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const busqueda = termino => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/answers_es?query=${termino}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const uso = (fechaInicio, fechaTermino) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/usage?fecha_inicio=${fechaInicio}&fecha_termino=${fechaTermino}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const alertas = (idEncuesta, fechaInicio, fechaTermino) => {
  const token = store.getState().login.token
  const inicio = format(fechaInicio, 'yyyy-MM-dd')
  const termino = format(fechaTermino, 'yyyy-MM-dd')
  const url = `${API_ROOT}/alerts/${idEncuesta}?fecha_inicio=${inicio}&fecha_termino=${termino}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const exportarRespuestas = (idEncuesta, fechaInicio, fechaTermino, tipo) => {
  const fi = format(fechaInicio, 'yyyy-MM-dd')
  const ft = format(fechaTermino, 'yyyy-MM-dd')
  const token = store.getState().login.token
  let url = `${API_ROOT}/report/${idEncuesta}?fecha_inicio=${fi}%2000%3A00&fecha_termino=${ft}%2023%3A59&type=${tipo === TIPO_EXPORTACION_RESUMEN ? 'tag' : 'text'}`
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

export const obtenerReacciones = (idEncuesta, idUsuario, start) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/reactions/${idEncuesta}/${idUsuario}`
  return axios.get(
    url,
    {
      headers: { 'Api-Token': token },
      params: { start }
    }
  )
}

export const agregarReaccion = (idEncuesta, idUsuario, start, emoji, texto) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/reactions/${idEncuesta}/${idUsuario}`
  return axios.post(
    url,
    {
      start,
      emoji,
      text: texto
    },
    { headers: { 'Api-Token': token } }
  )
}

export const eliminarReaccion = (idEncuesta, idUsuario, idReaccion) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/reactions/${idEncuesta}/${idUsuario}`
  return axios({
    url,
    method: 'delete',
    data: { id: idReaccion },
    headers: {
      'Api-Token': token,
      'Content-Type': 'application/json'
    }
  })
}