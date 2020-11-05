import React from 'react'
import Icon from '@iconify/react'
import iconoExportar from '@iconify/icons-mdi/download'
import './ExportadorRespuestas.css'
import { useSelector } from 'react-redux'
import { exportarRespuestas } from '../../../../../api/endpoints'

const ExportadorRespuestas = () => {

  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)

  const descargarCSV = () => {
    exportarRespuestas(idEncuestaSeleccionada, fechaInicio, fechaTermino)
  }

  return (
    <div className="ExportadorRespuestas">
      <button
        className="SelectorRangoFechas__boton_opciones"
        title="Exportar a CSV"
        onClick={descargarCSV}
      >
        <Icon className="SelectorRangoFechas__boton_opciones_icono" icon={iconoExportar} />
      </button>
    </div>
  )
}

export default ExportadorRespuestas
