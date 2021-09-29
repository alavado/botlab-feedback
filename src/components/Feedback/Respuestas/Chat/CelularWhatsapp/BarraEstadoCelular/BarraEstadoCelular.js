import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { InlineIcon } from '@iconify/react'
import iconoBateria from '@iconify/icons-mdi/battery'
import iconoSeñal from '@iconify/icons-mdi/signal'
import iconoWifi from '@iconify/icons-mdi/wifi'
import './BarraEstadoCelular.css'

const BarraEstadoCelular = () => {

  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const actualizarHora = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(actualizarHora)
  }, [])

  return (
    <div className="BarraEstadoCelular">
      <div>
        {format(hora, 'HH:mm')}
      </div>
      <div className="BarraEstadoCelular__iconos">
        <InlineIcon icon={iconoWifi} className="BarraEstadoCelular__icono" />
        <InlineIcon icon={iconoSeñal} className="BarraEstadoCelular__icono" />
        <InlineIcon icon={iconoBateria} className="BarraEstadoCelular__icono" />
      </div>
    </div>
  )
}

export default BarraEstadoCelular
