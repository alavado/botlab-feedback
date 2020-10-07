import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import './TablaRespuestas.css'
import { guardaRespuestas } from '../../../redux/ducks/encuestas'

const TablaRespuestas = () => {

  const { token } = useSelector(state => state.login)
  const { idEncuestaSeleccionada, headers, respuestas } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`https://api.dev.botlab.cl/poll_users/${idEncuestaSeleccionada}`, {
        headers: { 'Api-Token': token }
      })
      dispatch(guardaRespuestas(data))
    }
    fetchData()
  }, [idEncuestaSeleccionada, token, dispatch])

  return (
    <div className="TablaRespuestas">
      <div className="TablaRespuestas__headers">
        {headers.map(({ nombre, texto }) => (
          <div
            key={`header-${nombre}`}
            className="TablaRespuestas__celda"
          >
            {texto}
          </div>
        ))}
      </div>
      {respuestas && respuestas.map((respuesta, i) => (
        <div
          key={`fila-respuestas-${i}`}
          className="TablaRespuestas__fila"
        >
          {headers.map((header, j) => (
            <div
              key={`celda-respuesta-${i}-${j}`}
              className="TablaRespuestas__celda"
            >
              {respuesta[header.nombre]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default TablaRespuestas
