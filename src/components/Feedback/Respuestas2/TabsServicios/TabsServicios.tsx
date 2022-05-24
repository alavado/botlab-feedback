import Icon from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useServiciosQuery } from '../../../../api/hooks'
import { RootState } from '../../../../redux/ducks'
import { seleccionaServicio } from '../../../../redux/ducks/servicio'
import './TabsServicios.css'

const TabsServicios = () => {

  const { idServicioActivo } = useSelector((state: RootState) => state.servicio)
  const { data: servicios, isLoading } = useServiciosQuery()
  const dispatch = useDispatch()

  if (isLoading) {
    return 'Cargando...'
  }

  if (!servicios) {
    return 'Error'
  }
  
  return (
    <div className="TabsServicios">
      {servicios.map((servicio, i) => (
        <button
          className={classNames({
            "TabsServicios__tab": true,
            "TabsServicios__tab--activo": servicio.id === idServicioActivo,
          })}
          key={`tab-servicio-${i}`}
          onClick={() => dispatch(seleccionaServicio(servicio.id))}
        >
          <Icon icon={servicio.icono} />
          {servicio.nombre}
        </button>
      ))}
    </div>
  )
}

export default TabsServicios