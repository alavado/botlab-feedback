import Icon, { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import iconoCerrarCajon from '@iconify/icons-mdi/chevron-double-right'
import './CajonInteraccion.css'
import { escondeCajonInteraccion } from '../../../../redux/ducks/servicio'
import { useComentariosInteraccionActivaQuery, useInteraccionActivaQuery } from '../../../../api/hooks'
import AvatarUsuarios from './AvatarUsuarios'
import { formatearCampoRespuestas } from '../../../../helpers/respuestas'
import MensajesInteraccion from './MensajesInteraccion'
import { Fragment } from 'react'
import Loader from '../../../Loader'

const CajonInteraccion = () => {

  const { cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  const { data } = useInteraccionActivaQuery()
  const { isLoading: cargandoComentarios } = useComentariosInteraccionActivaQuery()

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
              ? <>
                  {data.citas.map((cita, i) => (
                    <Fragment key={`CajonInteraccion-icono-cita-${i}`}>
                      {cita.nombre.split(' ')[0]}
                      <span
                        className="CajonInteraccion__icono_estado_interaccion"
                        title={cita.estadoInteraccion.explicacion}
                      >
                        <InlineIcon icon={cita.estadoInteraccion.icono} />
                      </span>
                      {i < data.citas.length - 1 && ', '}
                    </Fragment>
                  ))}
                </>
              : <>
                  {data.citas[0].nombre}
                  <span
                    className="CajonInteraccion__icono_estado_interaccion"
                    title={data.citas[0].estadoInteraccion.explicacion}
                  >
                    <InlineIcon icon={data.citas[0].estadoInteraccion.icono} />
                  </span>
                </>
            : 'Cargando...'
          }
        </h2>
        <p className="CajonInteraccion__subtitulo">
          {data?.telefonoUsuario
            ? formatearCampoRespuestas(data.telefonoUsuario, 'phone')
            : <span className="CajonInteraccion__skeleton_telefono" />
          }
        </p>
      </div>
      <div className="CajonInteraccion__mensajes">
        {data?.conversaciones && !cargandoComentarios
          ? <MensajesInteraccion />
          : <div className="CajonInteraccion__loader">
              <Loader color="var(--color-texto)" />
            </div>
        }
      </div>
    </div>
  )
}

export default CajonInteraccion