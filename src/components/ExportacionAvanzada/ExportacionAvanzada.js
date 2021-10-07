import React, { useEffect } from 'react'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import classNames from 'classnames'
import iconoExportar from '@iconify/icons-mdi/table-export'
import Icon from '@iconify/react'
import './ExportacionAvanzada.css'
import { exportarRespuestas } from '../../api/endpoints'
import { useSelector } from 'react-redux'
import ModalExportacionAvanzada from './ModalExportacionAvanzada'

export const tiposExportacion = [
  {
    nombre: 'CSV',
    extension: 'csv'
  },
  {
    nombre: 'Excel',
    extension: 'xlsx'
  }
]

const ExportacionAvanzada = () => {

  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const [inicio, setInicio] = useState(fechaInicio)
  const [termino, setTermino] = useState(fechaTermino)
  const [email, setEmail] = useState('')
  const [exportando, setExportando] = useState(false)
  const [modalVisible, setModalVisible] = useState(true)
  const [error, setError] = useState()
  const [extension, setExtension] = useState(tiposExportacion[0].extension)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  const exportar = e => {
    e.preventDefault()
    if (exportando) {
      return
    }
    setExportando(true)
    exportarRespuestas(idEncuestaSeleccionada, inicio, termino, email, extension)
      .then(() => {
        setExportando(false)
        setModalVisible(true)
      })
      .catch(err => setError(err))
  }

  useEffect(() => {
    if (termino < inicio) {
      setInicio(termino)
    }
  }, [termino])

  useEffect(() => {
    if (inicio > termino) {
      setTermino(inicio)
    }
  }, [inicio])

  return (
    <div className="ExportacionAvanzada">
      <ModalExportacionAvanzada
        email={email}
        visible={modalVisible}
        ocultar={() => setModalVisible(false)}
      />
      <div className="ExportacionAvanzada__superior">
        <h1 className="ExportacionAvanzada__titulo">Reporte</h1>
      </div>
      <div className="ExportacionAvanzada__contenedor">
        <form
          className="ExportacionAvanzada__contenedor_formulario"
          onSubmit={exportar}
        >
          <h2 className="ExportacionAvanzada__subtitulo">Periodo</h2>
          <div className="ExportacionAvanzada__contenedor_rango">
            <ReactDatePicker
              selected={inicio}
              onChange={f => setInicio(f)}
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
                  "ExportacionAvanzada__boton--activo": tipo.extension === extension
                })}
                type="button"
                onClick={() => setExtension(tipo.extension)}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>
          <h2 className="ExportacionAvanzada__subtitulo">E-mail</h2>
          <div className="ExportacionAvanzada__contenedor_rango">
            <input
              className="ExportacionAvanzada__input"
              type="email"
              required
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <button
            className="ExportacionAvanzada__boton_exportar"
            type="submit"
            disabled={exportando}
          >
            {exportando
              ? <><div className="ExportacionAvanzada__loader_exportando" /> Generando...</>
              : <><Icon className="ExportacionAvanzada__icono" icon={iconoExportar} /> Generar reporte</>
            }
          </button>
          <p className="ExportacionAvanzada__explicacion">
            Este módulo permite exportar todas las respuestas de la encuesta seleccionada a una planilla de datos. La planilla será enviada al e-mail indicado en unos minutos.
          </p>
        </form>
        {error}
      </div>
    </div>
  )
}

export default ExportacionAvanzada
