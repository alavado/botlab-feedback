import React, { useEffect } from 'react'
import diccionarioTags from '../../../../../../helpers/tags'
import classNames from 'classnames'
import './SelectorConversacion.css'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const SelectorConversacion = ({ conversaciones, indiceConversacionSeleccionada, seleccionarConversacion }) => {

  useEffect(() => {
    const botonesSeleccion = document.getElementsByClassName('SelectorConversacion__boton')
    if (botonesSeleccion.length > 0) {
      botonesSeleccion[conversaciones.length - 1].scrollIntoView()
    }
  }, [conversaciones])

  if (!conversaciones || conversaciones.length === 1) {
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
            data-title={format(parseISO(c.start), 'dd MMM yyyy', { locale: es })}
          >
          </button>
        )
      })}
    </div>
  )
}

export default SelectorConversacion
