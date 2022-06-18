import { Icon } from '@iconify/react'
import iconoExportar from '@iconify/icons-mdi/download-outline'
import './ExportadorRespuestas.css'
import { useDispatch, useSelector } from 'react-redux'
import { exportarTablaRespuestas } from '../../../../../helpers/tablaRespuestas'
import { fijaTablaDestacada } from '../../../../../redux/ducks/respuestas'

const ExportadorRespuestas = ({ cargando }) => {

  const { respuestasVisibles: respuestas, fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const { tipos, idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()
  const encuestaSeleccionada = tipos?.find(t => t.id === idEncuestaSeleccionada)

  if (!encuestaSeleccionada) {
    return null
  }

  const descargarCSV = () => exportarTablaRespuestas(headers, respuestas, encuestaSeleccionada.nombre, fechaInicio, fechaTermino)

  return (
    <div className="ExportadorRespuestas">
      <button
        className="ExportadorRespuestas__boton"
        tooltip="Exportar tabla a CSV"
        onClick={descargarCSV}
        disabled={cargando}
        onMouseEnter={() => dispatch(fijaTablaDestacada(true))}
        onMouseLeave={() => dispatch(fijaTablaDestacada(false))}
      >
        <Icon className="ExportadorRespuestas__icono" icon={iconoExportar} />
        Exportar
      </button>
    </div>
  )
}

export default ExportadorRespuestas
