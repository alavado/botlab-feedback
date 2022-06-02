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

  console.log(data)

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
        <div
          className="CajonInteraccion__avatar"
          style={{ background: `hsl(${360 * ((data?.citas[0]?.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)` }}
        >
          {data?.citas[0]?.nombre[0]}
        </div>
        <h2 className="CajonInteraccion__titulo">{data?.citas[0]?.nombre}</h2>
        <p className="CajonInteraccion__subtitulo">+555 55 555 234</p>
      </div>
    </div>
  )
}

export default CajonInteraccion