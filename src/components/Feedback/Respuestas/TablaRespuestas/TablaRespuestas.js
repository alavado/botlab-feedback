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
import { columnaEstaColapsada } from '../../../../helpers/tablaRespuestas'
import { toggleaColapsoColumna } from '../../../../redux/ducks/opciones'
import FooterTablaRespuestas from './FooterTablaRespuestas'

const respuestasPorPagina = 20

const TablaRespuestas = () => {

  const [pagina, setPagina] = useState(1)
  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const { columnasColapsadas } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  const history = useHistory()

  const verChat = respuesta => () => {
    dispatch(guardaEstaRespuesta(respuesta))
    history.push(`/respuestas/chat/${idEncuestaSeleccionada}/${respuesta.user_id}`)
  }

  useEffect(() => setPagina(1), [respuestas])

  const cargando = !respuestas || !headers

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
                        'TablaRespuestas__header--oculto': columnaEstaColapsada(idEncuestaSeleccionada, nombre, columnasColapsadas)
                      })}
                      title={texto}
                      onClick={() => dispatch(toggleaColapsoColumna(idEncuestaSeleccionada, nombre))}
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
                    className={classNames({
                      'TablaRespuestas__fila': true
                    })}
                    onClick={verChat(respuesta)}
                  >
                    {headers.map(({ nombre }, j) => (
                      <td
                        key={`celda-respuesta-${i}-${j}`}
                        className={classNames({
                          'TablaRespuestas__celda': true,
                          'TablaRespuestas__celda--oculta': columnaEstaColapsada(idEncuestaSeleccionada, nombre, columnasColapsadas)
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
          <FooterTablaRespuestas
            respuestasPorPagina={respuestasPorPagina}
            totalRespuestas={respuestas ? respuestas.length : 0}
            pagina={pagina}
            setPagina={setPagina}
          />
        </>
      }
    </div>
  )
}

export default TablaRespuestas
