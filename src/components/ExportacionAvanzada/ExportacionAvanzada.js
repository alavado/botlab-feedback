import React from 'react'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import classNames from 'classnames'
import iconoExportar from '@iconify/icons-mdi/table-export'
import Icon from '@iconify/react'
import './ExportacionAvanzada.css'
import { exportarRespuestas } from '../../api/endpoints'
import { useSelector } from 'react-redux'
import { tiposExportacion } from '../../helpers/exportar'

const ExportacionAvanzada = () => {

  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const [inicio, setInicio] = useState(fechaInicio)
  const [termino, setTermino] = useState(fechaTermino)
  const [exportando, setExportando] = useState(false)
  const [tipoExportacion, setTipoExportacion] = useState(tiposExportacion[0])
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  const exportar = () => {
    if (exportando) {
      return
    }
    setExportando(true)
    exportarRespuestas(idEncuestaSeleccionada, inicio, termino, tipoExportacion)
      .then(() => setExportando(false))
  }
  
  return (
    <div className="ExportacionAvanzada">
      <div className="ExportacionAvanzada__superior">
        <h1 className="ExportacionAvanzada__titulo">Reporte</h1>
      </div>
      <div className="ExportacionAvanzada__contenedor">
        <div className="ExportacionAvanzada__contenedor_formulario">
          <h2 className="ExportacionAvanzada__subtitulo">Período</h2>
          <div className="ExportacionAvanzada__contenedor_rango">
            <ReactDatePicker
              selected={inicio}
              onChange={f => setInicio(f)}
              maxDate={termino}
              dateFormat="d MMMM yyyy"
              locale="es"
              className="SelectorRangoFechas__datepicker"
              required
            />
            -
            <ReactDatePicker
              selected={termino}
              onChange={f => setTermino(f)}
              dateFormat="d MMMM yyyy"
              locale="es"
              className="SelectorRangoFechas__datepicker"
              required
            />
          </div>
          <h2 className="ExportacionAvanzada__subtitulo">Formato</h2>
          <div className="ExportacionAvanzada__botones_tipos">
            {tiposExportacion.map((tipo, i) => (
              <button
                key={`boton-tipo-exportacion-${i}`}
                className={classNames({
                  "ExportacionAvanzada__boton": true,
                  "ExportacionAvanzada__boton--activo": tipo === tipoExportacion
                })}
                onClick={() => setTipoExportacion(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>
          <h2 className="ExportacionAvanzada__subtitulo">E-mail</h2>
          <div className="ExportacionAvanzada__contenedor_rango">
            <input
              className="SelectorRangoFechas__datepicker"
              type="email"
              required
            />
          </div>
          <button
            className="ExportacionAvanzada__boton_exportar"
            onClick={exportar}
          >
            {exportando
              ? <div className="ExportacionAvanzada__loader_exportando" />
              : <Icon className="ExportacionAvanzada__icono" icon={iconoExportar} />
            }
            Generar reporte
          </button>
          <p className="ExportacionAvanzada__explicacion">
            Este módulo permite exportar todas las respuestas de la encuesta seleccionada a una planilla de datos.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExportacionAvanzada
