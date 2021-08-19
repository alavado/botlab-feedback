import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'
import Scrambler from '../../../../../../helpers/Scrambler/Scrambler'
import TagRespuesta from '../../TagRespuesta'
import './FilaTablaRespuestas.css'

const FilaTablaRespuestas = ({ respuesta, indice, onClick, headers }) => {

  const { columnaDestacada } = useSelector(state => state.respuestas)

  const emoji = respuesta.reactions.length > 0
    ? respuesta.reactions.slice(-1)[0].reaction_emoji
    : ''
  
  return (
    <tr
      className="FilaTablaRespuestas"
      onClick={onClick}
    >
      {process.env.NODE_ENV === 'development' && 
        <td className="FilaTablaRespuestas__celda FilaTablaRespuestas__celda--sin-padding">
          <div className="FilaTablaRespuestas__contenedor_reaccion">
            {emoji}
          </div>
        </td>
      }
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