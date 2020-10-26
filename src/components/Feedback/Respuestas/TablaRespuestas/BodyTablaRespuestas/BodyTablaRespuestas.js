import React from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'
import './BodyTablaRespuestas.css'
import { columnaEstaColapsada } from '../../../../../helpers/tablaRespuestas'
import TagRespuesta from '../TagRespuesta'

const BodyTablaRespuestas = ({ pagina, respuestasPorPagina }) => {

  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const { columnasColapsadas } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  const history = useHistory()

  const verChat = respuesta => () => {
    dispatch(guardaEstaRespuesta(respuesta))
    history.push(`/respuestas/chat/${idEncuestaSeleccionada}/${respuesta.user_id}`)
  }

  return (
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
  )
}

export default BodyTablaRespuestas
