import classNames from 'classnames'
import { parseISO } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import {
  formatearCampoRespuestas,
  formatearFecha,
} from '../../../../../../helpers/respuestas'
import Scrambler from '../../../../../Scrambler'
import { fijaFilaTablaDestacada } from '../../../../../../redux/ducks/respuestas'
import TagRespuesta from '../../TagRespuesta'
import './FilaTablaRespuestas.css'
import useAnalytics from '../../../../../../hooks/useAnalytics'
import InteractionCommentIcon from '../../../../InteractionDrawer/InteractionComments/InteractionComment/InteractionCommentIcon'
import { Icon } from '@iconify/react'

const FilaTablaRespuestas = ({ respuesta, indice, onClick, headers }) => {
  const { columnaDestacada, filaTablaDestacada } = useSelector(
    (state) => state.respuestas
  )
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
    Object.keys(respuesta).forEach((h) => {
      if (
        h.match(/_[0-9]$/) &&
        Number(h.slice(-1)) > respuesta.n_appointments
      ) {
        respuestaManipulada[h] = ''
      }
    })
  }

  let fechaAgregadaLegible = ''

  if (ultimaReaccion) {
    fechaAgregadaLegible = formatearFecha(
      parseISO(ultimaReaccion.created_at),
      true
    )
  }

  return (
    <tr
      className={classNames({
        FilaTablaRespuestas: true,
        'FilaTablaRespuestas--destacada': indice === filaTablaDestacada,
      })}
      onClick={clickEnFila}
      title={
        indice === filaTablaDestacada
          ? 'Este fue el último chat que revisaste'
          : ''
      }
    >
      <td className="FilaTablaRespuestas__celda FilaTablaRespuestas__celda--sin-padding">
        {ultimaReaccion && (
          <span className="FilaTablaRespuestas__contenedor_reaccion">
            <InteractionCommentIcon emoji={ultimaReaccion.reaction_emoji} />
            {ultimaReaccion.reaction_text && (
              <span
                className="FilaTablaRespuestas__contenedor_reaccion_indicador_comentario"
                onMouseEnter={() =>
                  track('Feedback', 'Respuestas', 'verPopupComentario', {
                    texto: ultimaReaccion.reaction_text,
                    emoji: ultimaReaccion.reaction_emoji,
                  })
                }
              >
                {ultimaReaccion.reaction_text}{' '}
                <span
                  style={{
                    fontStyle: 'italic',
                    opacity: 0.8,
                    paddingLeft: '.2rem',
                  }}
                >
                  {fechaAgregadaLegible}
                </span>
              </span>
            )}
          </span>
        )}
      </td>
      {headers.map(({ nombre, f, texto, tipo }, j) => {
        let valorHeader = f
          ? f(respuestaManipulada)
          : respuestaManipulada[nombre]
        return (
          <td
            key={`celda-respuesta-${indice}-${j}`}
            className={classNames({
              FilaTablaRespuestas__celda: true,
              'FilaTablaRespuestas__celda--destacada': columnaDestacada === j,
            })}
          >
            {tipo === 'ICON' ? (
              <div title={valorHeader.label}>
                <Icon
                  className="FilaTablaRespuestas__channel_icon"
                  icon={`mdi:${valorHeader.icon}`}
                  title={valorHeader.label}
                />
              </div>
            ) : valorHeader && valorHeader.tag !== undefined ? (
              <span
                className="FilaTablaRespuestas__contenedor_tag"
                title={valorHeader.text}
              >
                <TagRespuesta
                  tag={valorHeader.tag}
                  pregunta={texto}
                  contactadoPorTelefono={
                    respuestaManipulada.is_unreachable?.whatsapp &&
                    !respuestaManipulada.is_unreachable?.phone
                  }
                />
              </span>
            ) : (
              <Scrambler tipo={nombre}>
                {formatearCampoRespuestas(valorHeader, nombre)}
              </Scrambler>
            )}
          </td>
        )
      })}
    </tr>
  )
}

export default FilaTablaRespuestas
