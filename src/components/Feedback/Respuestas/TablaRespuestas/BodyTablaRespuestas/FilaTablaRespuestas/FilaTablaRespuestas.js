import classNames from 'classnames'
import { isToday, isTomorrow, isYesterday, parseISO, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useDispatch, useSelector } from 'react-redux'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'
import Scrambler from '../../../../../Scrambler'
import { fijaFilaTablaDestacada } from '../../../../../../redux/ducks/respuestas'
import TagRespuesta from '../../TagRespuesta'
import './FilaTablaRespuestas.css'
import useAnalytics from '../../../../../../hooks/useAnalytics'

const FilaTablaRespuestas = ({ respuesta, indice, onClick, headers }) => {

  const { columnaDestacada, filaTablaDestacada } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const track = useAnalytics()

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

  let fechaAgregadaLegible = ''

  if (ultimaReaccion) {
    let fechaAgregada = parseISO(ultimaReaccion.created_at)
    fechaAgregadaLegible = (isYesterday(fechaAgregada) ? 'ayer, ' : '') + (isToday(fechaAgregada) ? 'hoy, ' : '') + (isTomorrow(fechaAgregada) ? 'mañana, ' : '') + format(fechaAgregada, 'EEEE d \'de\' MMMM \'a las\' HH:mm', { locale: es })
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
              <span
                className="FilaTablaRespuestas__contenedor_reaccion_indicador_comentario"
                onMouseEnter={() => track('Feedback', 'Respuestas', 'verPopupComentario', { texto: ultimaReaccion.reaction_text, emoji: ultimaReaccion.reaction_emoji })}
              >
                {ultimaReaccion.reaction_text} <span style={{ fontStyle: 'italic', opacity: .8, paddingLeft: '.2rem' }}>{fechaAgregadaLegible}</span>
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