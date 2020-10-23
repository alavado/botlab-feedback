import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaEstaRespuesta } from '../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'
import SelectorRangoFechas from '../SelectorRangoFechas'
import classNames from 'classnames'
import './TablaRespuestas.css'
import BuscadorRespuestas from '../BuscadorRespuestas'
import LoaderRespuestas from './LoaderRespuestas'
import TagRespuesta from './TagRespuesta'

const respuestasPorPagina = 20

const TablaRespuestas = () => {

  const [pagina, setPagina] = useState(1)
  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const history = useHistory()
  const cargando = !respuestas || !headers

  const verChat = respuesta => () => {
    dispatch(guardaEstaRespuesta(respuesta))
    history.push(`/respuestas/chat/${idEncuestaSeleccionada}/${respuesta.user_id}`)
  }

  useEffect(() => setPagina(1), [respuestas])

  const numeroPaginas = 1 + respuestas && Math.ceil(respuestas.length / respuestasPorPagina)
  const headersOcultos = []

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
              {/* <span className="TablaRespuestas__numero_total">{respuestas.length.toLocaleString('de-DE')}</span> resultados - mostrando {50 * (pagina - 1) + 1} a {Math.min(50 * pagina, respuestas.length)} */}
              <span className="TablaRespuestas__numero_total">{respuestas.length.toLocaleString('de-DE')}</span> resultados
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
