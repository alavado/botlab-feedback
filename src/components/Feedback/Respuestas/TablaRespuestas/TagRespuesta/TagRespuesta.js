import React from 'react'
import { diccionarioTags } from '../../../../../helpers/tags'
import { InlineIcon } from '@iconify/react'
import './TagRespuesta.css'

const TagRespuesta = ({ tag }) => {

  if (!tag) {
    tag = Object.keys(diccionarioTags).slice(-1)[0]
  }

  return (
    <div className={diccionarioTags[tag].clase}>
      <InlineIcon className="TagRespuesta__icono" icon={diccionarioTags[tag].icono} />
      {diccionarioTags[tag].texto && <span>{diccionarioTags[tag].texto}</span>}
    </div>
  )
}

export default TagRespuesta
