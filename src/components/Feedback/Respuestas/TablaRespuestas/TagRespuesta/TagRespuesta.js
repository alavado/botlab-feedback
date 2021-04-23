import React from 'react'
import { diccionarioTags } from '../../../../../helpers/tags'
import { InlineIcon } from '@iconify/react'
import './TagRespuesta.css'

const TagRespuesta = ({ tag }) => {

  if (!tag) {
    return null
  }

  const clase = diccionarioTags[tag]?.clase || 'TagRespuesta--vacia'
  const texto = diccionarioTags[tag]?.texto || tag

  return (
    <div className={clase}>
      {diccionarioTags[tag] && <InlineIcon className="TagRespuesta__icono" icon={diccionarioTags[tag].icono} />}
      {<span>{texto}</span>}
    </div>
  )
}

export default TagRespuesta
