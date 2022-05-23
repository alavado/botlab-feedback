import Icon from '@iconify/react'
import { useDispatch } from 'react-redux'
import { useServiciosQuery } from '../../../../api/hooks'
import { seleccionaServicio } from '../../../../redux/ducks/servicio'
import './TabsServicios.css'

const TabsServicios = () => {

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