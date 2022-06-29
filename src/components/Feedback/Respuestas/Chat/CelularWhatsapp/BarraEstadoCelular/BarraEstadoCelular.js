import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { InlineIcon } from '@iconify/react'
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
        <InlineIcon icon="mdi:wifi" className="BarraEstadoCelular__icono" />
        <InlineIcon icon="mdi:signal" className="BarraEstadoCelular__icono" />
        <InlineIcon icon="mdi:battery" className="BarraEstadoCelular__icono" />
      </div>
    </div>
  )
}

export default BarraEstadoCelular
