import React from 'react'
import { Icon } from '@iconify/react'
import iconoVolver from '@iconify/icons-mdi/arrow-back'
import iconoExpandir from '@iconify/icons-mdi/arrow-expand'
import './BarraAppCelular.css'
import { useDispatch, useSelector } from 'react-redux'
import { fijaChatExpandido } from '../../../../../../redux/ducks/opciones'

const BarraAppCelular = () => {

  const { nombreUsuario } = useSelector(state => state.login)
  const dispatch = useDispatch()

  return (
    <div className="BarraAppCelular">
      <div className="BarraAppCelular__izquierda">
        <Icon icon={iconoVolver} className="BarraAppCelular__icono_volver" />
        <div className="BarraAppCelular__avatar">G</div>
        <div className="BarraAppCelular__contenedor_nombre">
          <div className="BarraAppCelular__nombre">
            Gaby de {nombreUsuario.split(' ')[0]}
          </div>
          <div className="BarraAppCelular__estado">
            en línea
          </div>
        </div>
      </div>
      <div
        onClick={() => dispatch(fijaChatExpandido(true))}
        className="BarraAppCelular__iconos"
        title="Vista expandida"
      >
        <Icon icon={iconoExpandir} />
      </div>
    </div>
  )
}

export default BarraAppCelular
