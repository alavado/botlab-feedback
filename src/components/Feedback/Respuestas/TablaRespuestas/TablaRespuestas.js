import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaRespuestas } from '../../../../redux/ducks/respuestas'
import { respuestas as respuestasAPI} from '../../../../api/endpoints'
import { useHistory } from 'react-router-dom'
import SelectorRangoFechas from '../SelectorRangoFechas'
import classNames from 'classnames'
import './TablaRespuestas.css'

const diccionarioTags = {
  '': 'Sin respuesta',
  'NO': 'Cancelaciones',
  'YES': 'Confirmaciones',
  'OUT': 'Inconclusas',
  'REAGENDA': 'Reagendamientos'
}

const respuestasPorPagina = 20

const TablaRespuestas = () => {

  const [cargando, setCargando] = useState(false)
  const [pagina, setPagina] = useState(1)
  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { fechaInicio, fechaTermino, respuestas } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (idEncuestaSeleccionada && fechaInicio && fechaTermino) {
      const fetchData = async () => {
        setCargando(true)
        const data = await respuestasAPI(idEncuestaSeleccionada, fechaInicio, fechaTermino)
        dispatch(guardaRespuestas(data))
        setCargando(false)
      }
      fetchData()
    }
  }, [idEncuestaSeleccionada, dispatch, fechaInicio, fechaTermino])

  const verChat = respuesta => () => {
    history.push(`/respuestas/chat/${idEncuestaSeleccionada}/${respuesta.user_id}`)
  }

  const headersOcultos = ['Fecha Solicitud', 'Hora']

  const primerYesNo = headers && headers.find(header => header.tipo === 'YESNO')
  const enumYesNo = primerYesNo && respuestas && Array.from(
    new Set(['Todas', ...respuestas.map(r => diccionarioTags[r[primerYesNo.nombre].tag])])
  )

  return (
    <div className="TablaRespuestas">
      <div className="TablaRespuestas__superior">
        <h1 className="TablaRespuestas__titulo">Respuestas</h1>
        <SelectorRangoFechas />
      </div>
      {respuestas && 
        <div className="TablaRespuestas__contenedor_tabla">
          <ul className="TablaRespuesta__selector_filtro_principal">
            {enumYesNo.map((valor, i) => (
              <li
                key={`enumyesno-${i}`}
                className="TablaRespuestas__selector_filtro_principal_opcion"
              >
                {valor}
              </li>
            ))}
          </ul>
          {cargando && <p>Obteniendo datos...</p>}
          <table className="TablaRespuestas__tabla">
            <thead>
              <tr className="TablaRespuestas__fila">
                {headers.map(({ nombre, texto }) => (
                  <th
                    key={`header-${nombre}`}
                    className={classNames({
                      'TablaRespuestas__header': true,
                      'TablaRespuestas__header--oculto': headersOcultos.includes(texto)
                    })}
                  >
                    {texto}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {respuestas && respuestas.slice(respuestasPorPagina * (pagina - 1), respuestasPorPagina * pagina).map((respuesta, i) => (
                <tr
                  key={`fila-respuestas-${i}`}
                  className="TablaRespuestas__fila"
                  onClick={verChat(respuesta)}
                >
                  {headers.map(({ nombre, texto }, j) => (
                    <td
                      key={`celda-respuesta-${i}-${j}`}
                      className={classNames({
                        'TablaRespuestas__celda': true,
                        'TablaRespuestas__celda--oculta': headersOcultos.includes(texto)
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
                {Array(Math.floor(respuestas.length / respuestasPorPagina)).fill(0).map((v, i) => (
                  <option key={`option-pagina-${i + 1}`} value={i + 1}>
                    Página {i + 1}
                  </option>
                ))}
              </select>
            </>
          }
        </div>
      }
    </div>
  )
}

export default TablaRespuestas
