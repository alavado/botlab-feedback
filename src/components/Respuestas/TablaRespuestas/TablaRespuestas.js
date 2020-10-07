import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import './TablaRespuestas.css'
import { guardaRespuestas } from '../../../redux/ducks/respuestas'
import { format } from 'date-fns'

const TablaRespuestas = () => {

  const [cargando, setCargando] = useState(false)
  const { token } = useSelector(state => state.login)
  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { fechaInicio, fechaTermino, respuestas } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true)
      const inicio = format(fechaInicio, 'yyyy-MM-dd')
      const termino = format(fechaTermino, 'yyyy-MM-dd')
      const url = `https://api.dev.botlab.cl/answers/${idEncuestaSeleccionada}?fecha_inicio=${inicio}&fecha_termino=${termino}`
      console.log(url)
      const data = await axios.get(url, {
        headers: { 'Api-Token': token }
      })
      dispatch(guardaRespuestas(data))
      setCargando(false)
    }
    fetchData()
  }, [idEncuestaSeleccionada, token, dispatch, fechaInicio, fechaTermino])

  return (
    <div className="TablaRespuestas">
      {cargando && <p>Obteniendo datos...</p>}
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
      {respuestas && respuestas.slice(0, 50).map((respuesta, i) => (
        <div
          key={`fila-respuestas-${i}`}
          className="TablaRespuestas__fila"
        >
          {headers.map((header, j) => (
            <div
              key={`celda-respuesta-${i}-${j}`}
              className="TablaRespuestas__celda"
            >
              {respuesta[header.nombre].tag ?? respuesta[header.nombre]}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default TablaRespuestas
