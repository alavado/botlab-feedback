import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'
import { columnaEstaColapsada } from '../../../../../helpers/tablaRespuestas'
import TagRespuesta from '../TagRespuesta'
import classNames from 'classnames'
import './BodyTablaRespuestas.css'

const BodyTablaRespuestas = ({ pagina, respuestasPorPagina }) => {

  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const { columnasColapsadas } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  const history = useHistory()

  const verChat = respuesta => () => {
    dispatch(guardaEstaRespuesta(respuesta))
    history.push(`/respuestas/chat/${idEncuesta}/${respuesta.user_id}`)
  }

  const respuestasPagina = respuestas && respuestas.slice(respuestasPorPagina * (pagina - 1), respuestasPorPagina * pagina)

  return (
    <tbody className="BodyTablaRespuestas">
      {respuestasPagina.map((respuesta, i) => (
        <tr
          key={`fila-respuestas-${i}`}
          className={classNames({
            'BodyTablaRespuestas__fila': true
          })}
          onClick={verChat(respuesta)}
        >
          {headers.map(({ nombre }, j) => (
            <td
              key={`celda-respuesta-${i}-${j}`}
              className={classNames({
                'BodyTablaRespuestas__celda': true,
                'BodyTablaRespuestas__celda--oculta': columnaEstaColapsada(idEncuesta, nombre, columnasColapsadas)
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
  )
}

export default BodyTablaRespuestas
