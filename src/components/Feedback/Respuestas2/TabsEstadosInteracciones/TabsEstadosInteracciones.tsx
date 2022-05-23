import Icon from '@iconify/react'
import { useDispatch } from 'react-redux'
import {  usePosiblesEstadosInteraccionesQuery } from '../../../../api/hooks'
import { seleccionaEstadoInteraccion } from '../../../../redux/ducks/servicio'
import './TabsEstadosInteracciones.css'

const TabsEstadosInteracciones = () => {

  const { data: estados, isLoading } = usePosiblesEstadosInteraccionesQuery()
  const dispatch = useDispatch()

  if (isLoading || !estados) {
    return null
  }

  return (
    <div className="TabsEstadosInteracciones">
      {estados.map((estado, i) => (
        <button
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