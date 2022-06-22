import { InlineIcon } from '@iconify/react'
import { format } from 'date-fns'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInteraccionesServicioYEstadoActivosQuery, useServiciosQuery } from '../../../../api/hooks'
import { muestraCajonInteraccion, seleccionaServicio } from '../../../../redux/ducks/servicio'
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
    default:
      return <>No hay citas sin respuesta</>
  }
}

const ListaInteracciones = () => {

  const { data: dataServicios } = useServiciosQuery()
  const { data, isLoading } = useInteraccionesServicioYEstadoActivosQuery()
  const { idServicioActivo, idEstadoInteraccionActivo, cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const { idUsuarioInteraccionActiva } = useSelector((state: RootState) => state.interaccion)
  const dispatch = useDispatch()

  if (isLoading || !data || !idServicioActivo) {
    return (
      <div className="ListaInteracciones">
        {!idServicioActivo && dataServicios && (
          <div className="ListaInteracciones__lista_servicios">
            <h2 className="ListaInteracciones__titulo_servicios">
              Servicios activos
            </h2>
            {dataServicios.filter(s => s.habilitado).map((servicio, i) => (
              <button
                className="ListaInteracciones__boton_servicio"
                key={`datos-servicio-${i}`}
                onClick={() => dispatch(seleccionaServicio(servicio.id))}
              >
                <div style={{ fontWeight: 'bold', gridRow: 'span 2' }}><InlineIcon icon={servicio.icono} /></div>
                <div style={{ fontWeight: 'bold' }}>{servicio.nombre}</div>
                <p style={{ gridRow: 'span 2', fontSize: '.8rem', placeSelf: 'center end' }}><InlineIcon icon="mdi:clock" /> {servicio.horaInicio.substring(0, 5)}</p>
                <p className="ListaInteracciones__descripcion_servicio">{servicio.descripcion}</p>
              </button>
            ))}
          </div>
        )}
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
        <div>Estado</div>
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
              <div>
                <div className="ListaInteracciones__estado_interaccion" style={{background: interaccion.estadoInteraccion.color}}>
                  <InlineIcon
                    icon={interaccion.estadoInteraccion.icono}
                  />
                  {interaccion.estadoInteraccion.descripcion}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>{j === 0 ? interaccion.comentarios[0]?.emoji : ''}</div>
              <div>
                {/* <div
                  style={{ background: `hsl(${360 * ((cita.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)` }}
                  className={classNames({
                    "ListaInteracciones__avatar": true,
                    "ListaInteracciones__avatar--visible": cajonInteraccionVisible && idUsuarioInteraccionActiva === interaccion.idUsuario,
                  })}
                >
                  {cita.nombre[0]}
                </div> */}
                {cita.nombre}
              </div>
              <div>{cita.fecha ? `${isTomorrow(cita.fecha) ? 'mañana, ' : ''}${format(cita.fecha, 'dd/MM')}` : '-'}</div>
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