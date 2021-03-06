import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { InlineIcon } from '@iconify/react'
import iconoBateria from '@iconify/icons-mdi/battery'
import iconoSeñal from '@iconify/icons-mdi/signal'
import './BarraEstadoCelular.css'

const BarraEstadoCelular = () => {

  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const actualizarHora = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(actualizarHora)
  }, [])

  return (
    <div className="BarraEstadoCelular">
      <InlineIcon icon={iconoSeñal} className="BarraEstadoCelular__icono" />
      100%
      <InlineIcon icon={iconoBateria} className="BarraEstadoCelular__icono" />
      {format(hora, 'HH:mm')}
    </div>
  )
}

export default BarraEstadoCelular
