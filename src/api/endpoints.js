import axios from 'axios'
import store from '../redux/store'
import { addDays, format } from 'date-fns'

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
  const inicio = format(fechaInicio ?? Date.now(), 'yyyy-MM-dd')
  const termino = format(fechaTermino ?? Date.now(), 'yyyy-MM-dd')
  const url = `${API_ROOT}/answers/${idEncuesta}?fecha_inicio=${inicio}%2000%3A00&fecha_termino=${termino}%2023%3A59`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const consultarMapping = idEncuesta => () => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/input_headers/${idEncuesta}`
  return axios.get(url, { headers: { 'Api-Token': token } })
}

export const crearEncuestas = ({ idEncuesta, datos }) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/poll_users/${idEncuesta}`
  return axios.post(
    url,
    {
      continue: 'True',
      data: datos
    },
    {
      headers: { 'Api-Token': token, 'Content-Type': 'application/json' }
    }
  )
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

export const alertas = () => {
  const token = store.getState().login.token
  const hoy = format(new Date(), 'yyyy-MM-dd')
  const hace7Dias = format(addDays(new Date(), -7), 'yyyy-MM-dd')
  const url = `${API_ROOT}/polls/alerts?start_date=${hace7Dias}&end_date=${hoy}`
  return axios.get(
    url,
    {
      headers: { 'Api-Token': token },
      transformResponse: res => {
        return JSON.parse(res).data
      }
    }
  )
}

export const marcarAlerta = (idAlerta, dismissed = true) => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/alerts/${idAlerta}`
  return axios.patch(
    url,
    {
      dismissed
    },
    {
      headers: {
        'Api-Token': token
      }
    }
  )
}

export const exportarRespuestas = (idEncuesta, fechaInicio, fechaTermino, email, attachment_extension) => {
  const date_start = format(fechaInicio, 'yyyy-MM-dd')
  const date_end = format(fechaTermino, 'yyyy-MM-dd')
  const token = store.getState().login.token
  let url = `${API_ROOT}/report_beta/${idEncuesta}`
  return axios.post(
    url,
    { date_start, date_end, email, attachment_extension },
    {
      headers: {
        'Api-Token': token,
        'Api-UTC-Offset': -180
      }
    }
  )
  .then(res => {
    console.log(res)
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

export const obtenerContenidoMultimedia = idRespuesta => {
  const token = store.getState().login.token
  const url = `${API_ROOT}/answer_media/${idRespuesta}`
  return axios({
    url,
    method: 'get',
    headers: {
      'Api-Token': token,
      'Content-Type': 'application/json'
    }
  })
}

export const obtenerVCard = idRespuesta => {
  return obtenerContenidoMultimedia(idRespuesta)
    .then(data => axios.get(data.data.data.url))
}