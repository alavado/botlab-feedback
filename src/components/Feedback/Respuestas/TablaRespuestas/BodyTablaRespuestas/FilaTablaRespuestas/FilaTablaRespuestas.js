import classNames from 'classnames'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import { encuestaTieneEmojisHabilitados } from '../../../../../../helpers/betas'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'
import Scrambler from '../../../../../../helpers/Scrambler/Scrambler'
import TagRespuesta from '../../TagRespuesta'
import './FilaTablaRespuestas.css'

const FilaTablaRespuestas = ({ respuesta, indice, onClick, headers }) => {

  const { idEncuestaSeleccionada: idEncuesta } = useSelector(state => state.encuestas)
  const { columnaDestacada } = useSelector(state => state.respuestas)

  if (!respuesta) {
    return null
  }
  
  return (
    <tr
      className="FilaTablaRespuestas"
      onClick={onClick}
    >
      {encuestaTieneEmojisHabilitados(idEncuesta) && (
        <td className="FilaTablaRespuestas__celda FilaTablaRespuestas__celda--sin-padding">
          {[...respuesta.reactions].reverse().slice(0, 1).map((r, i) => (
            <div className="FilaTablaRespuestas__contenedor_reaccion">
              {r.reaction_emoji}
              {r.reaction_text && (
                <div className="FilaTablaRespuestas__contenedor_reaccion_indicador_comentario">
                  {r.reaction_text} - {formatDistanceToNow(parseISO(r.created_at), { locale: es, addSuffix: true, includeSeconds: false })}
                </div>
              )}
            </div>
          ))}
        </td>
      )}
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