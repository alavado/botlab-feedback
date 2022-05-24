import { format } from 'date-fns'
import { Fragment } from 'react'
import { useInteraccionesServicioYEstadoActivosQuery } from '../../../../api/hooks'
import './ListaInteracciones.css'

const ListaInteracciones = () => {

  const { data, isLoading } = useInteraccionesServicioYEstadoActivosQuery()

  if (isLoading) {
    return 'Cargando...'
  }

  if (!data) {
    return null
  }

  return (
    <div className="ListaInteracciones">
      <div
        className="ListaInteracciones__interaccion ListaInteracciones__interaccion--encabezados"
      >
        <div>Fecha cita</div>
        <div>Hora cita</div>
        <div>Paciente</div>
        <div>Tratante</div>
      </div>
      {data.length === 0
        ? <div>No hay citas</div>
        : data.map((interaccion, i) => (
            <div
              key={`interaccion-${i}`}
              className="ListaInteracciones__interaccion"
            >
              {interaccion.citas.map((cita, j) => (
                <Fragment
                  key={`cita-${j}`}
                >
                  <div>{cita.fecha ? format(cita.fecha, 'dd/MM') : '-'}</div>
                  <div>{cita.fecha ? format(cita.fecha, 'HH:mm') : '-'}</div>
                  <div>{cita.nombre}</div>
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