import Icon from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useServiciosQuery } from '../../../../api/hooks'
import { RootState } from '../../../../redux/ducks'
import { toggleCajonFiltros, seleccionaServicio } from '../../../../redux/ducks/servicio'
import iconoMenu from '@iconify/icons-mdi/filter-list'
import './TabsServicios.css'

const TabsServicios = () => {

  const { idServicioActivo } = useSelector((state: RootState) => state.servicio)
  const { data: servicios, isLoading } = useServiciosQuery()
  const dispatch = useDispatch()
  
  return (
    <div className="TabsServicios">
      <button
        className="TabsServicios__boton_menu"
        onClick={() => dispatch(toggleCajonFiltros())}
      >
        <Icon icon={iconoMenu} />
      </button>
      {isLoading || !servicios
        ? <>
            <button
              className="TabsServicios__tab TabsServicios__tab--cargando"
            >
              <div className="TabsServicios__skeleton_avatar_cargando" />
              <div className="TabsServicios__skeleton_texto_cargando" />
            </button>
            <button
              className="TabsServicios__tab TabsServicios__tab--cargando"
            >
              <div className="TabsServicios__skeleton_avatar_cargando" />
              <div className="TabsServicios__skeleton_texto_cargando" />
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