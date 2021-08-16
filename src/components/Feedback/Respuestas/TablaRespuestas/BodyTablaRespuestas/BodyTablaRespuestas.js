import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'
import './BodyTablaRespuestas.css'
import Skeleton from '../../../../Skeleton'
import { obtenerHeaders } from '../../../../../helpers/tablaRespuestas'
import FilaTablaRespuestas from './FilaTablaRespuestas'

const BodyTablaRespuestas = ({ respuestasPorPagina }) => {

  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas, pagina } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const history = useHistory()

  const verChat = (respuesta, indice) => {
    console.log('vc')
    dispatch(guardaEstaRespuesta([respuesta, indice]))
    history.push(`/chat/${idEncuesta}/${respuesta.user_id}`)
  }

  const respuestasPagina = respuestas && respuestas.slice(respuestasPorPagina * (pagina - 1), respuestasPorPagina * pagina)

  const headersOrdenados = useMemo(() => obtenerHeaders(headers, idEncuesta), [headers, idEncuesta])

  if (!headersOrdenados) {
    return null
  }

  return (
    <tbody className="BodyTablaRespuestas">
      {respuestasPagina
        ? respuestasPagina.map((respuesta, i) => (
            <FilaTablaRespuestas
              key={`fila-respuestas-${respuesta.respuestaString}`}
              respuesta={respuesta}
              onClick={() => verChat(respuesta, respuestasPorPagina * (pagina - 1) + i)}
              headers={headersOrdenados}
              indice={i}
            />
          ))
        : Array(respuestasPorPagina).fill(0).map((x, i) => (
            <tr
              key={`fila-skeleton-respuestas-${i}`}
              className="BodyTablaRespuestas__fila"
            >
              <td style={{ width: '1.45rem' }}></td>
              {headersOrdenados.map((_, j) => (
                <td
                  key={`celda-skeleton-respuesta-${i}-${j}`}
                  className="FilaTablaRespuestas__celda"
                >
                  <Skeleton />
                </td>
              ))}
            </tr>
          ))
      }
    </tbody>
  )
}

export default BodyTablaRespuestas
