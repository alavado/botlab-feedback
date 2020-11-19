import React from 'react'
import Icon from '@iconify/react'
import icono from '@iconify/icons-mdi/chat-remove-outline'
import './Error403.css'

const Error403 = ({ mensaje }) => {
  return (
    <div className="Error403">
      <Icon icon={icono} className="Error403__icono" />
      <p className="Error403__mensaje">{mensaje}</p>
    </div>
  )
}

export default Error403
