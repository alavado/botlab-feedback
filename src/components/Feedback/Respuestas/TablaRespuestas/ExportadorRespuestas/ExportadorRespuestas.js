import { Icon } from '@iconify/react'
import './ExportadorRespuestas.css'
import { useDispatch, useSelector } from 'react-redux'
import { exportarTablaRespuestas } from '../../../../../helpers/tablaRespuestas'
import { fijaTablaDestacada } from '../../../../../redux/ducks/respuestas'
import useAnalytics from '../../../../../hooks/useAnalytics'

const ExportadorRespuestas = ({ cargando }) => {
  const {
    respuestasVisibles: respuestas,
    fechaInicio,
    fechaTermino,
  } = useSelector((state) => state.respuestas)
  const { tipos, idEncuestaSeleccionada, headers } = useSelector(
    (state) => state.encuestas
  )
  const dispatch = useDispatch()
  const encuestaSeleccionada = tipos?.find(
    (t) => t.id === idEncuestaSeleccionada
  )
  const track = useAnalytics()

  if (!encuestaSeleccionada) {
    return null
  }

  const descargarArchivo = () => {
    track('Feedback', 'Respuestas', 'exportarTabla', {
      idEncuesta: idEncuestaSeleccionada,
      encuesta: encuestaSeleccionada.nombre,
      fechaInicio,
      fechaTermino,
    })
    exportarTablaRespuestas(
      headers,
      respuestas,
      encuestaSeleccionada.nombre,
      fechaInicio,
      fechaTermino,
      idEncuestaSeleccionada,
      'xlsx'
    )
  }

  return (
    <div className="ExportadorRespuestas">
      <button
        className="ExportadorRespuestas__boton"
        tooltip="Exportar tabla a Excel"
        onClick={descargarArchivo}
        disabled={cargando}
        onMouseEnter={() => dispatch(fijaTablaDestacada(true))}
        onMouseLeave={() => dispatch(fijaTablaDestacada(false))}
      >
        <Icon
          className="ExportadorRespuestas__icono"
          icon="mdi:table-arrow-down"
        />
        Exportar
      </button>
    </div>
  )
}

export default ExportadorRespuestas
