import Icon from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import {  usePosiblesEstadosInteraccionesQuery } from '../../../../api/hooks'
import { RootState } from '../../../../redux/ducks'
import { seleccionaEstadoInteraccion } from '../../../../redux/ducks/servicio'
import './TabsEstadosInteracciones.css'

const TabsEstadosInteracciones = () => {

  const { data: estados, isLoading } = usePosiblesEstadosInteraccionesQuery()
  const { idEstadoInteraccionActivo } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  if (isLoading || !estados) {
    return null
  }

  return (
    <div className="TabsEstadosInteracciones">
      {estados.map((estado, i) => (
        <button
          className={classNames({
            "TabsEstadosInteracciones__tab": true,
            "TabsEstadosInteracciones__tab--activo": estado.id === idEstadoInteraccionActivo
          })}
          key={`boton-estado-${i}`}
          onClick={() => dispatch(seleccionaEstadoInteraccion(estado.id))}
        >
          <Icon icon={estado.icono} />
          {estado.descripcion}
        </button>
      ))}
    </div>
  )
}

export default TabsEstadosInteracciones