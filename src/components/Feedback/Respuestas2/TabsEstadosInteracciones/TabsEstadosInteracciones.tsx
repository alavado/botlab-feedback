import Icon from '@iconify/react'
import {  usePosiblesResultadosInteraccionesQuery } from '../../../../api/hooks'
import './TabsEstadosInteracciones.css'

const TabsEstadosInteracciones = () => {

  const { data: estados, isLoading } = usePosiblesResultadosInteraccionesQuery()

  console.log({estados})

  if (isLoading || !estados) {
    return null
  }

  return (
    <div className="TabsEstadosInteracciones">
      {estados.map((estado, i) => (
        <button
          key={`boton-estado-${i}`}
        >
          <Icon icon={estado.icono} />
          {estado.descripcion}
        </button>
      ))}
    </div>
  )
}

export default TabsEstadosInteracciones