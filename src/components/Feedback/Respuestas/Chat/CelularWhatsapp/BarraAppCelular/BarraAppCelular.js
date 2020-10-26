import React from 'react'
import { Icon } from '@iconify/react'
import iconoVolver from '@iconify/icons-mdi/arrow-back'
import iconoTelefono from '@iconify/icons-mdi/phone'
import './BarraAppCelular.css'
import { useSelector } from 'react-redux'

const BarraAppCelular = () => {

  const { nombreUsuario } = useSelector(state => state.login)

  return (
    <div className="BarraAppCelular">
      <div className="BarraAppCelular__izquierda">
        <Icon icon={iconoVolver} className="BarraAppCelular__icono_volver" />
        <div className="BarraAppCelular__avatar" />
        <div className="BarraAppCelular__contenedor_nombre">
          <div className="BarraAppCelular__nombre">
            Gaby de {nombreUsuario.split(' ')[0]}
          </div>
          <div className="BarraAppCelular__estado">
            en línea
          </div>
        </div>
      </div>
      <div className="BarraAppCelular__iconos">
        <Icon icon={iconoTelefono} />
      </div>
    </div>
  )
}

export default BarraAppCelular
