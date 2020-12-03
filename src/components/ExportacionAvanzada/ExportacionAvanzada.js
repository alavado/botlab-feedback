import React from 'react'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import classNames from 'classnames'
import iconoExportar from '@iconify/icons-mdi/arrow-top-right'
import Icon from '@iconify/react'
import './ExportacionAvanzada.css'

const tiposExportacion = [
  'Resumen',
  'Detalle',
  'Chats'
]

const ExportacionAvanzada = () => {

  const [inicio, setInicio] = useState(Date.now())
  const [termino, setTermino] = useState(Date.now())
  const [tipoExportacion, setTipoExportacion] = useState(tiposExportacion[0])

  const exportar = () => {

  }
  
  return (
    <div className="ExportacionAvanzada">
      <div className="ExportacionAvanzada__superior">
        <h1 className="ExportacionAvanzada__titulo">Exportar</h1>
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
            />
            -
            <ReactDatePicker
              selected={termino}
              onChange={f => setTermino(f)}
              dateFormat="d MMMM yyyy"
              locale="es"
              className="SelectorRangoFechas__datepicker"
            />
          </div>
          <h2 className="ExportacionAvanzada__subtitulo">Tipo de exportación</h2>
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
          <button
            className="ExportacionAvanzada__boton_exportar"
            onClick={exportar}
          >
            <Icon className="ExportadorRespuestas__icono" icon={iconoExportar} />
            Exportar
          </button>
          <p className="ExportacionAvanzada__explicacion">
            Este módulo permite exportar los datos de respuestas a un archivo en formato CSV.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExportacionAvanzada
