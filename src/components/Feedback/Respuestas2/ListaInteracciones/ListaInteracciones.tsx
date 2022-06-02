import { InlineIcon } from '@iconify/react'
import { format } from 'date-fns'
import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInteraccionesServicioYEstadoActivosQuery } from '../../../../api/hooks'
import { muestraCajonInteraccion } from '../../../../redux/ducks/servicio'
import CajonInteraccion from '../CajonInteraccion'
import iconoSinCitas from '@iconify/icons-mdi/robot'
import './ListaInteracciones.css'
import { EstadoInteraccion, IDEstadoInteraccion } from '../../../../api/types/servicio'
import { RootState } from '../../../../redux/ducks'
import { estadosInteracciones } from '../../../../api/estadosInteraccion'
import classNames from 'classnames'
import { isTomorrow } from 'date-fns/esm'

const obtenerMensajeSinCitas = (idEstado: IDEstadoInteraccion | undefined) => {
  const estado = estadosInteracciones.find(e => e.id === idEstado) as EstadoInteraccion
  switch (idEstado) {
    case 'CONFIRMADA':
      return <>No hay citas <InlineIcon icon={estado.icono} /> confirmadas</>
    case 'CANCELADA':
      return <>No hay citas <InlineIcon icon={estado.icono} /> anuladas</>
    case 'REAGENDADA':
      return <>No hay citas <InlineIcon icon={estado.icono} /> reagendadas</>
    case 'IMPROCESABLE':
      return <>No hay citas <InlineIcon icon={estado.icono} /> que no haya entendido</>
    default:
      return <>No hay citas <InlineIcon icon={estado.icono} /> sin respuesta</>
  }
}

const ListaInteracciones = () => {

  const { data, isLoading } = useInteraccionesServicioYEstadoActivosQuery()
  const { idEstadoInteraccionActivo, cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const [idInteraccionSeleccionada, setIdInteraccionSeleccionada] = useState(-1)
  const dispatch = useDispatch()

  if (isLoading) {
    return <div></div>
  }

  if (!data || !idEstadoInteraccionActivo) {
    return <div className="ListaInteracciones" />
  }

  console.log(data)

  return (
    <div className="ListaInteracciones">
      <CajonInteraccion />
      <div
        className="ListaInteracciones__interaccion ListaInteracciones__interaccion--encabezados"
      >
        <div>Inicio interacción</div>
        <div>Paciente</div>
        <div>Fecha cita</div>
        <div>Hora cita</div>
        <div>Tratante</div>
        <div>Sucursal</div>
      </div>
      {data.length === 0
        ? <div className="ListaInteracciones__sin_citas">
            <InlineIcon className="ListaInteracciones__icono_sin_citas" icon={iconoSinCitas} />
            <p className="ListaInteracciones__mensaje_sin_citas">
              {obtenerMensajeSinCitas(idEstadoInteraccionActivo)}
            </p>
          </div>
        : data.map((interaccion, i) => (
            <div
              key={`interaccion-${i}`}
              className={classNames({
                "ListaInteracciones__interaccion": true,
                "ListaInteracciones__interaccion--inactiva": !cajonInteraccionVisible || (idInteraccionSeleccionada > 0 && idInteraccionSeleccionada !== interaccion.idUsuario),
                "ListaInteracciones__interaccion--activa": cajonInteraccionVisible && idInteraccionSeleccionada === interaccion.idUsuario,
              })}
              onClick={() => {
                setIdInteraccionSeleccionada(interaccion.idUsuario)
                dispatch(muestraCajonInteraccion())
              }}
            >
              {interaccion.citas.map((cita, j) => (
                <Fragment
                  key={`cita-${j}`}
                >
                  <div>{j === 0 ? format(interaccion.inicio, "HH:mm") : ''}</div>
                  <div>
                    <div
                      style={{ background: `hsl(${360 * ((cita.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)` }}
                      className={classNames({
                        "ListaInteracciones__avatar": true,
                        "ListaInteracciones__avatar--visible": cajonInteraccionVisible && idInteraccionSeleccionada === interaccion.idUsuario,
                      })}
                    >
                      {cita.nombre[0]}
                    </div>
                    {cita.nombre} <InlineIcon className="ListaInteracciones__icono_estado_interaccion" icon={cita.estadoInteraccion.icono} />
                  </div>
                  <div>{cita.fecha ? `${isTomorrow(cita.fecha) ? 'mañana, ' : ''}${format(cita.fecha, 'd/M')}` : '-'}</div>
                  <div>{cita.fecha ? format(cita.fecha, 'HH:mm') : '-'}</div>
                  <div>{cita.responsable}</div>
                  <div>{interaccion.sucursal}</div>
                </Fragment>
              ))}
            </div>
          ))
      }
    </div>
  )
}

export default ListaInteracciones