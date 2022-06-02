import Icon from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import iconoCerrarCajon from '@iconify/icons-mdi/chevron-double-right'
import './CajonInteraccion.css'
import { escondeCajonInteraccion } from '../../../../redux/ducks/servicio'
import { useQuery, useQueryClient } from 'react-query'
import { Interaccion } from '../../../../api/types/servicio'

const CajonInteraccion = () => {

  const { cajonInteraccionVisible, interaccionActiva, idServicioActivo } = useSelector((state: RootState) => state.servicio)
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const data = queryClient.getQueryData(['interaccion', idServicioActivo, interaccionActiva?.idUsuario]) as Interaccion

  return (
    <div className={classNames({
      "CajonInteraccion": true,
      "CajonInteraccion--visible": cajonInteraccionVisible
    })}>
      <button
        className={
          classNames({
            "CajonInteraccion__boton_cerrar": true,
            "CajonInteraccion__boton_cerrar--visible": cajonInteraccionVisible,
          })
        }
        onClick={e => {
          e.stopPropagation()
          dispatch(escondeCajonInteraccion())
        }}
      >
        <Icon icon={iconoCerrarCajon} />
      </button>
      <div className="CajonInteraccion__superior">
        {data.citas[0].nombre}
      </div>
    </div>
  )
}

export default CajonInteraccion