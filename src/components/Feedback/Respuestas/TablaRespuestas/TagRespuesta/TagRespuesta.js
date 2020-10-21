import React from 'react'
import { diccionarioTags } from '../../../../../helpers/tags'
import { InlineIcon } from '@iconify/react'
import './TagRespuesta.css'

const TagRespuesta = ({ tag }) => {

  if (!tag) {
    return null
  }

  return (
    <div
      className={diccionarioTags[tag].clase}
    >
      <InlineIcon className="TagRespuesta__icono" icon={diccionarioTags[tag].icono} />
      {diccionarioTags[tag].texto}
    </div>
  )
}

export default TagRespuesta
