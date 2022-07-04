import { Icon } from '@iconify/react'
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
  
  return (
    <div className="TabsServicios">
      <button className="TabsServicios__tab">
        <Icon icon="mdi:robot" />
      </button>
      {/* <button
        className="TabsServicios__boton_menu"
        onClick={() => dispatch(toggleCajonFiltros())}
      >
        <Icon icon="mdi:menu" />
      </button> */}
      {isLoading || !servicios
        ? <>
            <button
              className="TabsServicios__tab TabsServicios__tab--cargando"
            >
              <div className="TabsServicios__skeleton">
                <Icon icon="mdi:user-circle" />
              </div>
              <div className="TabsServicios__skeleton">
                Confirmación
              </div>
            </button>
            <button
              className="TabsServicios__tab TabsServicios__tab--cargando"
            >
              <div className="TabsServicios__skeleton">
                <Icon icon="mdi:user-circle" />
              </div>
              <div className="TabsServicios__skeleton">
                Confirmación Multicita
              </div>
            </button>
          </>
        : servicios.map((servicio, i) => (
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
          ))
      }
    </div>
  )
}

export default TabsServicios