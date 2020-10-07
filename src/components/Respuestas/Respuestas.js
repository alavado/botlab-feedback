import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import './Respuestas.css'
import { useHistory } from 'react-router-dom'
import { guardaHeadersEcuesta, guardaTiposEncuestas } from '../../redux/ducks/encuestas'

const Respuestas = () => {

  const { token } = useSelector(state => state.login)
  const { tipos, headers } = useSelector(state => state.encuestas)
  const history = useHistory()
  const dispatch = useDispatch()

  if (!token) {
    history.push('/')
    return null
  }

  // useEffect(() => {
  //   axios.get('https://api.botlab.cl/answer_headers/110')
  // })

  const verEncuesta = async id => {
    try {
      const data = await axios.get(`https://api.dev.botlab.cl/answer_headers/${id}`, {
        headers: {
          'Api-Token': token
        }
      })
      dispatch(guardaHeadersEcuesta(data))
    } catch (e) {
      console.error('un error')
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
    </div>
  )
}

export default Respuestas
