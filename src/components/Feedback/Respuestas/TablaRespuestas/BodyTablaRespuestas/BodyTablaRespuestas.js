import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'
import TagRespuesta from '../TagRespuesta'
import classNames from 'classnames'
import './BodyTablaRespuestas.css'
import Skeleton from '../../../../Skeleton'
import { InlineIcon } from '@iconify/react'
import iconoVerChat from '@iconify/icons-mdi/chevron-right'

const BodyTablaRespuestas = ({ respuestasPorPagina }) => {

  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas, pagina } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const history = useHistory()

  const verChat = (respuesta, indice) => () => {
    dispatch(guardaEstaRespuesta([respuesta, indice]))
    history.push(`/chat/${idEncuesta}/${respuesta.user_id}`)
  }

  const respuestasPagina = respuestas && respuestas.slice(respuestasPorPagina * (pagina - 1), respuestasPorPagina * pagina)

  const headersOrdenados = useMemo(() => {
    if (!headers) {
      return null
    }
    return [
      ...headers.filter(h => h.tipo === 'YESNO'),
      ...headers.filter(h => h.tipo === 'RANGE'),
      ...headers.filter(h => h.tipo !== 'YESNO' && h.tipo !== 'RANGE')
    ]
  }, [headers])

  if (!headersOrdenados) {
    return null
  }

  return (
    <>
      <div className="BodyTablaRespuestas__indicador_accion">
        ver chat <InlineIcon icon={iconoVerChat} />
      </div>
      <tbody className="BodyTablaRespuestas">
        {respuestasPagina ?
          respuestasPagina.map((respuesta, i) => (
              <tr
                key={`fila-respuestas-${i}`}
                className={classNames({
                  'BodyTablaRespuestas__fila': true
                })}
                onClick={verChat(respuesta, respuestasPorPagina * (pagina - 1) + i)}
              >
                <td className="BodyTablaRespuestas__celda BodyTablaRespuestas__celda--numero">{respuestasPorPagina * (pagina - 1) + i + 1}</td>
                {headersOrdenados.map(({ nombre }, j) => (
                  <td
                    key={`celda-respuesta-${i}-${j}`}
                    className="BodyTablaRespuestas__celda"
                  >
                    {respuesta[nombre] && respuesta[nombre].tag !== undefined
                      ? <div style={{ display: 'flex', justifyContent: 'flex-start' }} title={respuesta[nombre].text}><TagRespuesta tag={respuesta[nombre].tag} /></div>
                      : respuesta[nombre]
                    }
                  </td>
                ))}
              </tr>
          ))
          : Array(respuestasPorPagina).fill(0).map((x, i) => (
              <tr
                key={`fila-skeleton-respuestas-${i}`}
                className="BodyTablaRespuestas__fila"
              >
                {headersOrdenados.map(({ nombre }, j) => (
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
    </>
  )
}

export default BodyTablaRespuestas
