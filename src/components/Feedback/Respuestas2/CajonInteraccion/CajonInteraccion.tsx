import Icon, { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import iconoCerrarCajon from '@iconify/icons-mdi/chevron-double-right'
import './CajonInteraccion.css'
import { escondeCajonInteraccion } from '../../../../redux/ducks/servicio'
import { useInteraccionActivaQuery } from '../../../../api/hooks'
import AvatarUsuarios from './AvatarUsuarios'
import { formatearCampoRespuestas } from '../../../../helpers/respuestas'
import MensajesInteraccion from './MensajesInteraccion'

const CajonInteraccion = () => {

  const { cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  const { data } = useInteraccionActivaQuery()

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
        <div className="CajonInteraccion__superior_avatar">
          <AvatarUsuarios />
        </div>
        <h2 className="CajonInteraccion__titulo">
          {data?.citas
            ? data.citas.length > 1
              ? <>{data.citas.map((c, i) => <>{c.nombre.split(' ')[0]} <InlineIcon icon={c.estadoInteraccion.icono} />{i < data.citas.length - 1 && ', '} </>)}</>
              : <>{data.citas[0].nombre} <InlineIcon icon={data.citas[0].estadoInteraccion.icono} /></>
            : 'Cargando...'
          }
        </h2>
        <p className="CajonInteraccion__subtitulo">
          {data?.telefonoUsuario
            ? formatearCampoRespuestas(data.telefonoUsuario, 'phone')
            : 'Cargando...'
          }
        </p>
      </div>
      <div className="CajonInteraccion__mensajes">
        {data?.conversaciones
          ? <MensajesInteraccion />
          : 'Cargando'
        }
      </div>
    </div>
  )
}

export default CajonInteraccion