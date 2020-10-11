import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaRespuestas } from '../../../../redux/ducks/respuestas'
import { respuestas as respuestasAPI} from '../../../../api/endpoints'
import classNames from 'classnames'
import './TablaRespuestas.css'

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

  const ocultos = ['ID Derivación', 'Fecha Solicitud', 'Hora']

  return (
    <div className="TablaRespuestas">
      {cargando && <p>Obteniendo datos...</p>}
      <table className="TablaRespuestas__tabla">
        <thead>
          <tr className="TablaRespuestas__fila">
            {headers.map(({ nombre, texto }) => (
              <th
                key={`header-${nombre}`}
                className={classNames({
                  'TablaRespuestas__header': true,
                  'TablaRespuestas__header--oculto': ocultos.includes(texto)
                })}
              >
                {texto}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {respuestas && respuestas.slice(25 * (pagina - 1), 25 * pagina).map((respuesta, i) => (
            <tr
              key={`fila-respuestas-${i}`}
              className="TablaRespuestas__fila"
            >
              {headers.map(({ nombre, texto }, j) => (
                <td
                  key={`celda-respuesta-${i}-${j}`}
                  className={classNames({
                    'TablaRespuestas__celda': true,
                    'TablaRespuestas__celda--oculta': ocultos.includes(texto)
                  })}
                >
                  {respuesta[nombre].tag ?? respuesta[nombre]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  )
}

export default TablaRespuestas
