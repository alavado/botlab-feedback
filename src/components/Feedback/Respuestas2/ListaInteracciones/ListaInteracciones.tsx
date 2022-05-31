import { InlineIcon } from '@iconify/react'
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
        <div>Inicio interacción</div>
        <div>Paciente</div>
        <div>Fecha cita</div>
        <div>Hora cita</div>
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