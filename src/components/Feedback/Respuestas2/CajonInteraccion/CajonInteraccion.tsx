import Icon, { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import iconoCerrarCajon from '@iconify/icons-mdi/chevron-double-right'
import './CajonInteraccion.css'
import { escondeCajonInteraccion } from '../../../../redux/ducks/servicio'
import { useInteraccionActivaQuery } from '../../../../api/hooks'
import { format } from 'date-fns'
import iconoBot from '@iconify/icons-mdi/robot'

const CajonInteraccion = () => {

  const { cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  const { data } = useInteraccionActivaQuery()

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
          style={{ background:
            data?.citas[0]
              ? `hsl(${360 * ((data.citas[0]?.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)`
              : `gray`
          }}
        >
          {data?.citas[0] ? data?.citas[0].nombre[0] : '-'}
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
          {data?.telefonoUsuario || 'Cargando...'}
        </p>
      </div>
      <div className="CajonInteraccion__mensajes">
        {data?.conversaciones
          ? data.conversaciones.map(conversacion => (
              conversacion.mensajes.map(mensaje => (
                <div
                  className={classNames({
                    "CajonInteraccion__mensaje": true,
                    "CajonInteraccion__mensaje--usuario": mensaje.emisor === 'USUARIO',
                    "CajonInteraccion__mensaje--bot": mensaje.emisor === 'BOT'
                  })}
                >
                  <p className="CajonInteraccion__mensaje_emisor">
                    {mensaje.emisor === 'BOT' && <InlineIcon icon={iconoBot} />}
                    {mensaje.emisor === 'BOT' ? data.nombreBot : data.citas[0].nombre.split(' ')[0]}
                  </p>
                  <p className="CajonInteraccion__mensaje_hora">{format(mensaje.timestamp, 'HH:mm')}</p>
                  <p className="CajonInteraccion__mensaje_contenido">{mensaje.mensaje}</p>
                </div>
              ))
            ))
          : 'Cargando'
        }
      </div>
    </div>
  )
}

export default CajonInteraccion