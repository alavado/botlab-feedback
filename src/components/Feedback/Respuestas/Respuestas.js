import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { headersRespuestas as headersAPI } from '../../../api/endpoints'
import { guardaHeadersEncuesta } from '../../../redux/ducks/encuestas'
import TablaRespuestas from './TablaRespuestas'
import SelectorRangoFechas from './SelectorRangoFechas'
import './Respuestas.css'

const Respuestas = () => {

  const { tipos, headers } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()
  const [cargando, setCargando] = useState(false)

  const verEncuesta = async id => {
    try {
      setCargando(true)
      const data = await headersAPI(id)
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
