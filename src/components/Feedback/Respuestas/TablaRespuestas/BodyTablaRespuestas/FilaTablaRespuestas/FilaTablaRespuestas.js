import classNames from 'classnames'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'
import Scrambler from '../../../../../../helpers/Scrambler/Scrambler'
import TagRespuesta from '../../TagRespuesta'
import FormularioReaccion from './FormularioReaccion'
import Icon from '@iconify/react'
import './FilaTablaRespuestas.css'

const FilaTablaRespuestas = ({ respuesta, indice, onClick, headers }) => {

  const { columnaDestacada } = useSelector(state => state.respuestas)
  const [agregandoReaccion, setAgregandoReaccion] = useState(false)
  const refElementoCentral = useRef()
  
  return (
    <tr
      className="FilaTablaRespuestas"
      onClick={onClick}
    >
      <td
        className="FilaTablaRespuestas__celda FilaTablaRespuestas__celda--sin-padding"
        ref={refElementoCentral}
      >
        <div
          className="FilaTablaRespuestas__contenedor_reaccion"
          onMouseEnter={() => !agregandoReaccion && setAgregandoReaccion(true)}
        >
        </div>
        <FormularioReaccion
          ocultar={() => {
            console.log('leave')
            setAgregandoReaccion(false)
          }}
          visible={agregandoReaccion}
          left={refElementoCentral.current?.getBoundingClientRect().left + refElementoCentral.current?.getBoundingClientRect().width / 2}
          top={refElementoCentral.current?.getBoundingClientRect().top + refElementoCentral.current?.getBoundingClientRect().height / 2}
        />
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