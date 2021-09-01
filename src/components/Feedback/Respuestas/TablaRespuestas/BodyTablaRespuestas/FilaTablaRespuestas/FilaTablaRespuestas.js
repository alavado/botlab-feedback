import classNames from 'classnames'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'
import Scrambler from '../../../../../../helpers/Scrambler/Scrambler'
import TagRespuesta from '../../TagRespuesta'
import './FilaTablaRespuestas.css'

const FilaTablaRespuestas = ({ respuesta, indice, onClick, headers }) => {

  const { columnaDestacada } = useSelector(state => state.respuestas)

  if (!respuesta) {
    return null
  }

  const ultimaReaccion = respuesta.reactions.slice(-1)[0]
  
  return (
    <tr
      className="FilaTablaRespuestas"
      onClick={onClick}
    >
      <td className="FilaTablaRespuestas__celda FilaTablaRespuestas__celda--sin-padding">
        {ultimaReaccion && (
          <div className="FilaTablaRespuestas__contenedor_reaccion">
            {ultimaReaccion.reaction_emoji}
            {ultimaReaccion.reaction_text && (
              <div className="FilaTablaRespuestas__contenedor_reaccion_indicador_comentario">
                {ultimaReaccion.reaction_text} <span style={{ fontStyle: 'italic', opacity: .8, paddingLeft: '.2rem' }}>{formatDistanceToNow(parseISO(ultimaReaccion.created_at), { locale: es, addSuffix: true, includeSeconds: false })}</span>
              </div>
            )}
          </div>
        )}
      </td>
      {headers.map(({ nombre, f, texto }, j) => {
        let valorHeader = f ? f(respuesta) : respuesta[nombre]
        return (
          <td
            key={`celda-respuesta-${indice}-${j}`}
            className={classNames({
              'FilaTablaRespuestas__celda': true,
              'FilaTablaRespuestas__celda--destacada': columnaDestacada === j
            })}
          >
            {valorHeader && valorHeader.tag !== undefined
              ? <div className="FilaTablaRespuestas__contenedor_tag" title={valorHeader.text}><TagRespuesta tag={valorHeader.tag} pregunta={texto} /></div>
              : <Scrambler tipo={nombre}>{formatearCampoRespuestas(valorHeader, nombre)}</Scrambler>
            }
          </td>
        )
      })}
    </tr>
  )
}

export default FilaTablaRespuestas