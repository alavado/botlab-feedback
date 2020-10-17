import React from 'react'
import { diccionarioTags } from '../../../../../helpers/tags'
import './TagRespuesta.css'

const TagRespuesta = ({ tag }) => {

  if (!tag) {
    return null
  }

  return (
    <div className={diccionarioTags[tag].clase}>
      {diccionarioTags[tag].texto}
    </div>
  )
}

export default TagRespuesta
