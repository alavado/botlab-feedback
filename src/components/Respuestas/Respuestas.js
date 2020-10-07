import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import './Respuestas.css'
import { useHistory } from 'react-router-dom'
import { guardaHeadersEncuesta } from '../../redux/ducks/encuestas'
import TablaRespuestas from './TablaRespuestas'
import SelectorRangoFechas from './SelectorRangoFechas'

const Respuestas = () => {

  const { token } = useSelector(state => state.login)
  const { tipos, headers } = useSelector(state => state.encuestas)
  const history = useHistory()
  const dispatch = useDispatch()
  const [cargando, setCargando] = useState(false)

  if (!token) {
    history.push('/')
    return null
  }

  const verEncuesta = async id => {
    try {
      setCargando(true)
      const data = await axios.get(`https://api.dev.botlab.cl/answer_headers/${id}`, {
        headers: { 'Api-Token': token }
      })
      dispatch(guardaHeadersEncuesta(id, data))
      setCargando(false)
    } catch (e) {
      console.error('un error', e)
    }
  }

  return (
    <div className="Respuestas">
      <h1>Respuestas</h1>
      {tipos.map(({ id, nombre }) => (
        <button
          key={`boton-${id}`}
          onClick={() => verEncuesta(id)}
        >
          Ver encuesta {nombre}
        </button>
      ))}
      <SelectorRangoFechas />
      {cargando && <p>Obteniendo headers...</p>}
      {headers && <TablaRespuestas />}
    </div>
  )
}

export default Respuestas
