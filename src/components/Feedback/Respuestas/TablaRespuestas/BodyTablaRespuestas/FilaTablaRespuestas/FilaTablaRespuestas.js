import classNames from 'classnames'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useDispatch, useSelector } from 'react-redux'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'
import Scrambler from '../../../../../Scrambler'
import { fijaFilaTablaDestacada } from '../../../../../../redux/ducks/respuestas'
import TagRespuesta from '../../TagRespuesta'
import './FilaTablaRespuestas.css'

const FilaTablaRespuestas = ({ respuesta, indice, onClick, headers }) => {

  const { columnaDestacada, filaTablaDestacada } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  if (!respuesta) {
    return null
  }

  const ultimaReaccion = respuesta.reactions.slice(-1)[0]

  const clickEnFila = () => {
    dispatch(fijaFilaTablaDestacada(indice))
    onClick()
  }

  let respuestaManipulada = { ...respuesta }
  if (respuesta.n_appointments) {
    Object.keys(respuesta).forEach(h => {
      if (h.match(/_[0-9]$/) && Number(h.slice(-1)) > respuesta.n_appointments) {
        respuestaManipulada[h] = ''
      }
    })
  }
  
  return (
    <tr
      className={classNames({
        "FilaTablaRespuestas": true,
        "FilaTablaRespuestas--destacada": indice === filaTablaDestacada
      })}
      onClick={clickEnFila}
    >
      <td className="FilaTablaRespuestas__celda FilaTablaRespuestas__celda--sin-padding">
        {ultimaReaccion && (
          <span className="FilaTablaRespuestas__contenedor_reaccion">
            {ultimaReaccion.reaction_emoji}
            {ultimaReaccion.reaction_text && (
              <span className="FilaTablaRespuestas__contenedor_reaccion_indicador_comentario">
                {ultimaReaccion.reaction_text} <span style={{ fontStyle: 'italic', opacity: .8, paddingLeft: '.2rem' }}>{formatDistanceToNow(parseISO(ultimaReaccion.created_at), { locale: es, addSuffix: true, includeSeconds: false })}</span>
              </span>
            )}
          </span>
        )}
      </td>
      {headers.map(({ nombre, f, texto }, j) => {
        let valorHeader = f ? f(respuestaManipulada) : respuestaManipulada[nombre]
        return (
          <td
            key={`celda-respuesta-${indice}-${j}`}
            className={classNames({
              'FilaTablaRespuestas__celda': true,
              'FilaTablaRespuestas__celda--destacada': columnaDestacada === j
            })}
          >
            {valorHeader && valorHeader.tag !== undefined
              ? <span className="FilaTablaRespuestas__contenedor_tag" title={valorHeader.text}><TagRespuesta tag={valorHeader.tag} pregunta={texto} /></span>
              : <Scrambler tipo={nombre}>{formatearCampoRespuestas(valorHeader, nombre)}</Scrambler>
            }
          </td>
        )
      })}
    </tr>
  )
}

export default FilaTablaRespuestas