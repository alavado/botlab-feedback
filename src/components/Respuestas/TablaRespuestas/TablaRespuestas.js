import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './TablaRespuestas.css'
import { guardaRespuestas } from '../../../redux/ducks/respuestas'
import { respuestas as respuestasAPI} from '../../../api/endpoints'

const TablaRespuestas = () => {

  const [cargando, setCargando] = useState(false)
  const [pagina, setPagina] = useState(1)
  const { token } = useSelector(state => state.login)
  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { fechaInicio, fechaTermino, respuestas } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true)
      const data = await respuestasAPI(idEncuestaSeleccionada, fechaInicio, fechaTermino)
      dispatch(guardaRespuestas(data))
      setCargando(false)
    }
    fetchData()
  }, [idEncuestaSeleccionada, token, dispatch, fechaInicio, fechaTermino])

  return (
    <div className="TablaRespuestas">
      {cargando && <p>Obteniendo datos...</p>}
      {respuestas &&
        <>
          <p>Se encontraron {respuestas.length} registros</p>
          <select onChange={e => setPagina(Number(e.target.value))}>
            {Array(Math.floor(respuestas.length / 25)).fill(0).map((v, i) => (
              <option key={`option-pagina-${i + 1}`} value={i + 1}>
                Página {i + 1}
              </option>
            ))}
          </select>
        </>
      }
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
      {respuestas && respuestas.slice(25 * (pagina - 1), 25 * pagina).map((respuesta, i) => (
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
