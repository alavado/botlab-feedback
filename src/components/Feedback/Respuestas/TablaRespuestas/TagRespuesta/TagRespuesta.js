import React from 'react'
import diccionarioTags from '../../../../../helpers/tags'
import { InlineIcon } from '@iconify/react'
import estrella from '@iconify/icons-mdi/star'
import './TagRespuesta.css'

const maxEstrellas = 5

const obtenerClaseTag = (tag, pregunta) => {
  if (diccionarioTags[tag]) {
    return diccionarioTags[tag].clase
  }
  else if (pregunta === 'Opción elegida' || pregunta == '¿Por qué no?') {
    return 'TagRespuesta--opcion_reagendamiento'
  }
  else if (!isNaN(tag)) {
    return 'TagRespuesta--nota'
  }
  return 'TagRespuesta TagRespuesta--vacia'
}

const obtenerTextoTag = (tag, pregunta) => {
  if (diccionarioTags[tag]) {
    return diccionarioTags[tag].texto
  }
  else if (pregunta === 'Opción elegida' || pregunta == '¿Por qué no?') {
    return tag
  }
  else if (!isNaN(tag)) {
    return (
      <>
        {Array(+tag).fill(0).map((_, i) => <InlineIcon key={`estrella-activa-${i}`} className="TagRespuesta__icono_estrella" icon={estrella} />)}
        {Array(Math.max(0, maxEstrellas - (+tag))).fill(0).map((_, i) => <InlineIcon key={`estrella-inactiva-${i}`} className="TagRespuesta__icono_estrella TagRespuesta__icono_estrella--inactiva" icon={estrella} />)}
      </>
    )
  }
  return tag
}

const TagRespuesta = ({ tag, pregunta }) => {

  if (!tag) {
    return null
  }

  const clase = obtenerClaseTag(tag, pregunta)
  const texto = obtenerTextoTag(tag, pregunta)

  return (
    <div className={clase}>
      {diccionarioTags[tag] && <InlineIcon className="TagRespuesta__icono" icon={diccionarioTags[tag].icono} />}
      <span>{texto}</span>
    </div>
  )
}

export default TagRespuesta
