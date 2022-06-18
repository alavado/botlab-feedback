import { Icon, InlineIcon } from '@iconify/react'
import { format } from 'date-fns'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInteraccionesServicioYEstadoActivosQuery } from '../../../../api/hooks'
import { muestraCajonInteraccion } from '../../../../redux/ducks/servicio'
import CajonInteraccion from '../CajonInteraccion'
import './ListaInteracciones.css'
import { IDEstadoInteraccion } from '../../../../api/types/servicio'
import { RootState } from '../../../../redux/ducks'
import classNames from 'classnames'
import { isTomorrow } from 'date-fns/esm'
import { seleccionaInteraccion } from '../../../../redux/ducks/interaccion'

const obtenerMensajeSinCitas = (idEstado: IDEstadoInteraccion | undefined) => {
  switch (idEstado) {
    case 'CONFIRMADA':
      return <>No hay citas confirmadas</>
    case 'CANCELADA':
      return <>No hay citas anuladas</>
    case 'REAGENDADA':
      return <>No hay citas reagendadas</>
    case 'IMPROCESABLE':
      return <>No hay citas que no haya entendido</>
    default:
      return <>No hay citas sin respuesta</>
  }
}

const ListaInteracciones = () => {

  const { data, isLoading } = useInteraccionesServicioYEstadoActivosQuery()
  const { idServicioActivo, idEstadoInteraccionActivo, cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const { idUsuarioInteraccionActiva } = useSelector((state: RootState) => state.interaccion)
  const dispatch = useDispatch()

  if (isLoading || !data || !idServicioActivo) {
    return (
      <div className="ListaInteracciones" />
    )
  }

  if (!idEstadoInteraccionActivo) {
    return (
      <div className="ListaInteracciones">
        <p className="ListaInteracciones__mensaje_paso_previo">
          <Icon
            className="ListaInteracciones__icono_paso_previo"
            icon="mdi:triangle-small-up"
          /> Selecciona un estado
        </p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="ListaInteracciones__sin_citas">
        <InlineIcon className="ListaInteracciones__icono_sin_citas" icon="mdi:robot" />
        <p className="ListaInteracciones__mensaje_sin_citas">
          {obtenerMensajeSinCitas(idEstadoInteraccionActivo)}
        </p>
      </div>
    )
  }
  
  return (
    <div className="ListaInteracciones">
      <CajonInteraccion />
      <div
        className="ListaInteracciones__interaccion ListaInteracciones__interaccion--encabezados"
      >
        <div></div>
        <div>Inicio interacción</div>
        <div
          title="Último comentario"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <InlineIcon style={{ fontSize: '.7rem', opacity: .75 }} icon="mdi:comment-check" />
        </div>
        <div>Paciente</div>
        <div>Fecha cita</div>
        <div>Hora cita</div>
        <div>Tratante</div>
        <div>Sucursal</div>
      </div>
      {data.map((interaccion, i) => (
        <div
          key={`interaccion-${i}`}
          className={classNames({
            "ListaInteracciones__interaccion": true,
            "ListaInteracciones__interaccion--inactiva": !cajonInteraccionVisible || (idUsuarioInteraccionActiva && idUsuarioInteraccionActiva !== interaccion.idUsuario),
            "ListaInteracciones__interaccion--activa": cajonInteraccionVisible && idUsuarioInteraccionActiva === interaccion.idUsuario,
          })}
          onClick={() => {
            dispatch(muestraCajonInteraccion())
            dispatch(seleccionaInteraccion([idServicioActivo, interaccion.idUsuario, interaccion.inicio]))
          }}
        >
          {interaccion.citas.map((cita, j) => (
            <Fragment
              key={`cita-${j}`}
            >
              <div>{j === 0 ? (i + 1) : ''}</div>
              <div>{j === 0 ? format(interaccion.inicio, "HH:mm") : ''} {interaccion.alertas.length > 0 && 'x'}</div>
              <div>{interaccion.comentarios[0]?.emoji}</div>
              <div>
                <div
                  style={{ background: `hsl(${360 * ((cita.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)` }}
                  className={classNames({
                    "ListaInteracciones__avatar": true,
                    "ListaInteracciones__avatar--visible": cajonInteraccionVisible && idUsuarioInteraccionActiva === interaccion.idUsuario,
                  })}
                >
                  {cita.nombre[0]}
                </div>
                {cita.nombre}
                <span
                  className="ListaInteracciones__icono_estado_interaccion"
                  title={cita.estadoInteraccion.explicacion}
                >
                  <InlineIcon
                    icon={cita.estadoInteraccion.icono}
                  />
                </span>
              </div>
              <div>{cita.fecha ? `${isTomorrow(cita.fecha) ? 'mañana, ' : ''}${format(cita.fecha, 'd/M')}` : '-'}</div>
              <div>{cita.fecha ? format(cita.fecha, 'HH:mm') : '-'}</div>
              <div>{cita.responsable}</div>
              <div>{interaccion.sucursal}</div>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ListaInteracciones