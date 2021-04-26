import React from 'react'
import { diccionarioTags } from '../../../../../helpers/tags'
import { InlineIcon } from '@iconify/react'
import estrella from '@iconify/icons-mdi/star'
import './TagRespuesta.css'
import { maxEstrellas } from '../../../../../api/endpoints'

const TagRespuesta = ({ tag }) => {

  if (!tag) {
    return null
  }

  const maximoDeEstrellas = maxEstrellas()

  const clase = diccionarioTags[tag]?.clase || (isNaN(tag) ? 'TagRespuesta TagRespuesta--vacia' : 'TagRespuesta--nota')
  const texto = diccionarioTags[tag]?.texto ||
    (isNaN(tag)
      ? tag :
      <>
        {Array(+tag).fill(0).map((_, i) => <InlineIcon key={`estrella-activa-${i}`} className="TagRespuesta__icono_estrella" icon={estrella} />)}
        {Array(Math.max(0, maximoDeEstrellas - (+tag))).fill(0).map((_, i) => <InlineIcon key={`estrella-inactiva-${i}`} className="TagRespuesta__icono_estrella TagRespuesta__icono_estrella--inactiva" icon={estrella} />)}
      </>
    )
  return (
    <div className={clase}>
      {diccionarioTags[tag] && <InlineIcon className="TagRespuesta__icono" icon={diccionarioTags[tag].icono} />}
      <span>{texto}</span>
    </div>
  )
}

export default TagRespuesta
