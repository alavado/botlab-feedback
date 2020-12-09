import React from 'react'
import Icon from '@iconify/react'
import iconoExportar from '@iconify/icons-mdi/arrow-top-right'
import './ExportadorRespuestas.css'
import { useSelector } from 'react-redux'
import { exportarTablaRespuestas } from '../../../../../helpers/tablaRespuestas'

const ExportadorRespuestas = ({ cargando }) => {

  const { respuestasVisibles } = useSelector(state => state.respuestas)
  const { headers } = useSelector(state => state.encuestas)

  const descargarCSV = () => {
    // exportarRespuestas(idEncuestaSeleccionada, fechaInicio, fechaTermino)
    exportarTablaRespuestas(headers, respuestasVisibles)
  }

  return (
    <div className="ExportadorRespuestas">
      <button
        className="ExportadorRespuestas__boton"
        title="Exportar tabla a CSV"
        onClick={descargarCSV}
        disabled={cargando}
      >
        <Icon className="ExportadorRespuestas__icono" icon={iconoExportar} />
        Exportar 
      </button>
    </div>
  )
}

export default ExportadorRespuestas
