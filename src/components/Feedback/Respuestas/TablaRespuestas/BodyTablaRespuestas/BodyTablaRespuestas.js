import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'
import TagRespuesta from '../TagRespuesta'
import classNames from 'classnames'
import './BodyTablaRespuestas.css'
import Skeleton from '../../../../Skeleton'
import Scrambler from '../../../../../helpers/Scrambler/Scrambler'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import { obtenerHeaders } from '../../../../../helpers/tablaRespuestas'
import iconoSmile from '@iconify/icons-mdi/dots-square'
import Icon from '@iconify/react'

const BodyTablaRespuestas = ({ respuestasPorPagina }) => {

  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas, pagina, columnaDestacada } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const history = useHistory()

  const verChat = (respuesta, indice) => () => {
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
            <tr
              key={`fila-respuestas-${i}`}
              className="BodyTablaRespuestas__fila"
              onClick={verChat(respuesta, respuestasPorPagina * (pagina - 1) + i)}
            >
              <td className="BodyTablaRespuestas__celda BodyTablaRespuestas__celda--sin-padding">
                <div className="x" title="Marcar esta respuesta">
                  <Icon icon={iconoSmile} style={{ opacity: 1 }} />
                  {/* {respuesta.reactions[0].reaction_text} */}
                </div>
              </td>
              {headersOrdenados.map(({ nombre, f, texto }, j) => {
                let valorHeader = f ? f(respuesta) : respuesta[nombre]
                return (
                  <td
                    key={`celda-respuesta-${i}-${j}`}
                    className={classNames({
                      'BodyTablaRespuestas__celda': true,
                      'BodyTablaRespuestas__celda--destacada': columnaDestacada === j
                    })}
                  >
                    {valorHeader && valorHeader.tag !== undefined
                      ? <div className="BodyTablaRespuestas__contenedor_tag" title={valorHeader.text}><TagRespuesta tag={valorHeader.tag} pregunta={texto} /></div>
                      : <Scrambler tipo={nombre}>{formatearCampoRespuestas(valorHeader, nombre)}</Scrambler>
                    }
                  </td>
                )
              })}
            </tr>
          ))
        : Array(respuestasPorPagina).fill(0).map((x, i) => (
            <tr
              key={`fila-skeleton-respuestas-${i}`}
              className="BodyTablaRespuestas__fila"
            >
              {headersOrdenados.map((_, j) => (
                <td
                  key={`celda-skeleton-respuesta-${i}-${j}`}
                  className="BodyTablaRespuestas__celda"
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
