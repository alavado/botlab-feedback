import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaEstaRespuesta, guardaRespuestas } from '../../../../redux/ducks/respuestas'
import { respuestas as respuestasAPI} from '../../../../api/endpoints'
import { useHistory } from 'react-router-dom'
import SelectorRangoFechas from '../SelectorRangoFechas'
import classNames from 'classnames'
import './TablaRespuestas.css'
import BuscadorRespuestas from '../BuscadorRespuestas'
import LoaderRespuestas from './LoaderRespuestas'
import TagRespuesta from './TagRespuesta'
import { diccionarioTags } from '../../../../helpers/tags'

const respuestasPorPagina = 50

const TablaRespuestas = () => {

  const [cargando, setCargando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [opcionActiva, setOpcionActiva] = useState(0)
  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { fechaInicio, fechaTermino, respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
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
    dispatch(guardaEstaRespuesta(respuesta))
    history.push(`/respuestas/chat/${idEncuestaSeleccionada}/${respuesta.user_id}`)
  }

  const numeroPaginas = 1 + respuestas && Math.ceil(respuestas.length / respuestasPorPagina)
  const headersOcultos = []

  const primerYesNo = headers && headers.find(header => header.tipo === 'YESNO')
  const enumYesNo = primerYesNo && respuestas && Array.from(
    new Set(['Todas', ...respuestas.map(r => diccionarioTags[r[primerYesNo.nombre].tag].titulo)])
  )

  return (
    <div className="TablaRespuestas">
      <div className="TablaRespuestas__superior">
        <h1 className="TablaRespuestas__titulo">Respuestas</h1>
        <SelectorRangoFechas />
        <BuscadorRespuestas />
      </div>
      {cargando
        ? <LoaderRespuestas />
        : <>
          <div className="TablaRespuestas__contenedor_tabla">
              <ul className="TablaRespuesta__selector_filtro_principal">
                {enumYesNo.map((valor, i) => (
                  <li
                    key={`enumyesno-${i}`}
                    className={classNames({
                      'TablaRespuestas__selector_filtro_principal_opcion': true,
                      'TablaRespuestas__selector_filtro_principal_opcion--activa': opcionActiva === i
                    })}
                    onClick={() => setOpcionActiva(i)}
                  >
                    {valor}
                  </li>
                ))}
              </ul>
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
                          {respuesta[nombre] && respuesta[nombre].tag !== undefined
                            ? <TagRespuesta tag={respuesta[nombre].tag} />
                            : respuesta[nombre]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          <div className="TablaRespuestas__footer">
            <p className="TablaRespuestas__total">
              <span className="TablaRespuestas__numero_total">{respuestas.length}</span> respuestas - mostrando {50 * (pagina - 1) + 1} a {Math.min(50 * pagina, respuestas.length)}
            </p>
            {respuestas.length > respuestasPorPagina &&
              <div className="TablaRespuestas__botones_paginas">
                <button
                  className="TablaRespuestas__boton_pagina"
                  onClick={() => setPagina(pagina - 1)}
                  disabled={pagina === 1}
                >
                  Anterior
                </button>
                <button
                  className="TablaRespuestas__boton_pagina"
                  onClick={() => setPagina(pagina + 1)}
                  disabled={numeroPaginas === 1 || pagina >= numeroPaginas}
                >
                  Siguiente
                </button>
              </div>
            }
          </div>
        </>
      }
    </div>
  )
}

export default TablaRespuestas
