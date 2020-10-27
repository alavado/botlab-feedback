import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import './DatosChat.css'
import { columnaEstaColapsada } from '../../../../../helpers/tablaRespuestas'
import TagRespuesta from '../../TablaRespuestas/TagRespuesta'
import iconoVolver from '@iconify/icons-mdi/arrow-left'
import { InlineIcon } from '@iconify/react'

const DatosChat = () => {

  const { respuestaSeleccionada: respuesta } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(state => state.encuestas)
  const { columnasColapsadas } = useSelector(state => state.opciones)

  if (!headers) {
    return null
  }

  return (
    <div className="DatosChat">
      <Link className="DatosChat__link_atras" to="/respuestas">
        <InlineIcon className="DatosChat__icono_volver" icon={iconoVolver} />
        Volver
      </Link>
      <h1 className="DatosChat__titulo">Datos del chat</h1>
      <div className="DatosChat__contenedor_datos">
        {headers.map(({ nombre, texto }, i) => (
          <div
            key={`header-chat-${i}`}
            className={classNames({
              DatosChat__contenedor_header: true,
              'DatosChat__contenedor_header--oculto': columnaEstaColapsada(idEncuesta, nombre, columnasColapsadas)
            })}
          >
            <div className="DatosChat__nombre_header">
              {texto}
            </div>
            <div className="DatosChat__valor_header">
              {respuesta[nombre] && respuesta[nombre].tag !== undefined
                ? <TagRespuesta tag={respuesta[nombre].tag} />
                : respuesta[nombre]
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DatosChat
