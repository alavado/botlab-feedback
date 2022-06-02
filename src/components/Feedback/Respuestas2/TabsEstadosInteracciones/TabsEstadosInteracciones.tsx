import Icon from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import {  usePosiblesEstadosInteraccionesQuery } from '../../../../api/hooks'
import { RootState } from '../../../../redux/ducks'
import { seleccionaEstadoInteraccion } from '../../../../redux/ducks/servicio'
import iconoApuntandoAServicioPrevio from '@iconify/icons-mdi/triangle-small-up'
import './TabsEstadosInteracciones.css'

const TabsEstadosInteracciones = () => {

  const { data, isLoading } = usePosiblesEstadosInteraccionesQuery()
  const { idEstadoInteraccionActivo } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  if (!isLoading && !data) {
    return (
      <div className="TabsEstadosInteracciones">
        <p className="TabsEstadosInteracciones__mensaje_paso_previo">
          <Icon
            className="TabsEstadosInteracciones__icono_paso_previo"
            icon={iconoApuntandoAServicioPrevio}
          /> Seleccione un servicio
        </p>
      </div>
    )
  }

  return (
    <div className="TabsEstadosInteracciones">
      {isLoading || !data
        ? <div className="TabsEstadosInteracciones"></div>
        : data.map(({ estado, conteo }, i) => (
            <button
              className={classNames({
                "TabsEstadosInteracciones__tab": true,
                "TabsEstadosInteracciones__tab--activo": estado.id === idEstadoInteraccionActivo
              })}
              key={`boton-estado-${i}`}
              onClick={() => dispatch(seleccionaEstadoInteraccion(estado.id))}
            >
              <Icon icon={estado.icono} />
              <div>
                <p>
                  {estado.descripcion}
                  <span
                    className={classNames({
                      "TabsEstadosInteracciones__conteo": true,
                      "TabsEstadosInteracciones__conteo--0": conteo === 0,
                    })}
                  >
                    {conteo}
                  </span>
                </p>
              </div>
            </button>
          ))
      }
    </div>
  )
}

export default TabsEstadosInteracciones