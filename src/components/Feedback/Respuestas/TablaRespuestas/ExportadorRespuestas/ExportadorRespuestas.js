import React from 'react'
import Icon from '@iconify/react'
import iconoExportar from '@iconify/icons-mdi/arrow-top-right'
import './ExportadorRespuestas.css'
import { useDispatch, useSelector } from 'react-redux'
import { exportarTablaRespuestas } from '../../../../../helpers/tablaRespuestas'
import { fijaTablaDestacada } from '../../../../../redux/ducks/respuestas'

const ExportadorRespuestas = ({ cargando }) => {

  const { respuestasVisibles } = useSelector(state => state.respuestas)
  const { headers } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  const descargarCSV = () => {
    // exportarRespuestas(idEncuestaSeleccionada, fechaInicio, fechaTermino)
    exportarTablaRespuestas(headers, respuestasVisibles)
  }

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
