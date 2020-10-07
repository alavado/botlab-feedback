import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import './Respuestas.css'
import { useHistory } from 'react-router-dom'
import { guardaHeadersEncuesta } from '../../redux/ducks/encuestas'
import TablaRespuestas from './TablaRespuestas'

const Respuestas = () => {

  const { token } = useSelector(state => state.login)
  const { tipos, headers } = useSelector(state => state.encuestas)
  const history = useHistory()
  const dispatch = useDispatch()

  if (!token) {
    history.push('/')
    return null
  }

  const verEncuesta = async id => {
    try {
      const data = await axios.get(`https://api.dev.botlab.cl/answer_headers/${id}`, {
        headers: { 'Api-Token': token }
      })
      dispatch(guardaHeadersEncuesta(id, data))
    } catch (e) {
      console.error('un error', e)
    }
  }
  console.log({headers})

  return (
    <div className="Respuestas">
      Respuestas
      {tipos.map(({ id, nombre }) => (
        <button
          key={`boton-${id}`}
          onClick={() => verEncuesta(id)}
        >
          Ver encuesta {nombre}
        </button>
      ))}
      {headers && <TablaRespuestas />}
    </div>
  )
}

export default Respuestas
