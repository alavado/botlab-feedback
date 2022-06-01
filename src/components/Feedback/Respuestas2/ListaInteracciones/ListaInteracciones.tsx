import { InlineIcon } from '@iconify/react'
import { format } from 'date-fns'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInteraccionesServicioYEstadoActivosQuery } from '../../../../api/hooks'
import { muestraCajonInteraccion } from '../../../../redux/ducks/servicio'
import CajonInteraccion from '../CajonInteraccion'
import iconoSinCitas from '@iconify/icons-mdi/robot'
import './ListaInteracciones.css'
import { EstadoInteraccion, IDEstadoInteraccion } from '../../../../api/types/servicio'
import { RootState } from '../../../../redux/ducks'
import { estadosInteracciones } from '../../../../api/estadosInteraccion'

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
  const { idEstadoInteraccionActivo } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  if (isLoading) {
    return <div></div>
  }

  if (!data || !idEstadoInteraccionActivo) {
    return <div className="ListaInteracciones" />
  }

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
              className="ListaInteracciones__interaccion"
              onClick={() => dispatch(muestraCajonInteraccion())}
            >
              {interaccion.citas.map((cita, j) => (
                <Fragment
                  key={`cita-${j}`}
                >
                  <div>{j === 0 ? format(interaccion.inicio, "HH:mm") : ''}</div>
                  <div>
                    {/* <div
                      style={{ background: `hsl(${360 * ((cita.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 75%, 46%)` }}
                      className="ListaInteracciones__avatar"
                    >
                      {cita.nombre[0]}
                    </div> */}
                    {cita.nombre} <InlineIcon icon={cita.estadoInteraccion.icono} />
                  </div>
                  <div>{cita.fecha ? format(cita.fecha, 'dd/MM') : '-'}</div>
                  <div>{cita.fecha ? format(cita.fecha, 'HH:mm') : '-'}</div>
                  <div>{cita.responsable}</div>
                </Fragment>
              ))}
            </div>
          ))
      }
    </div>
  )
}

export default ListaInteracciones