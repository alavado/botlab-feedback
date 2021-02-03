import React from 'react'
import { diccionarioTags } from '../../../../../../helpers/tags'
import classNames from 'classnames'
import './SelectorConversacion.css'

const SelectorConversacion = ({ conversaciones, indiceConversacionSeleccionada, seleccionarConversacion }) => {

  if (!conversaciones) {
    return null
  }

  return (
    <div className="SelectorConversacion">
      {conversaciones.map((c, i) => {
        const primerTag = c.tags[0].tag
        return (
          <button
            key={`boton-seleccion-conversacion-${i}`}
            className={classNames({
              'SelectorConversacion__boton': true,
              'SelectorConversacion__boton--seleccionado': i === indiceConversacionSeleccionada
            })}
            style={{ background: diccionarioTags[primerTag].color }}
            onClick={() => seleccionarConversacion(i)}
          >
          </button>
        )
      })}
    </div>
  )
}

export default SelectorConversacion
