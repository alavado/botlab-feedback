import { useEffect, useRef } from 'react'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { Icon } from '@iconify/react'
import './ExportacionAvanzada.css'
import { exportarRespuestas } from '../../api/endpoints'
import { useSelector } from 'react-redux'
import ModalExportacionAvanzada from './ModalExportacionAvanzada'
import useAnalytics from '../../hooks/useAnalytics'
import { formatearNombreEncuesta } from '../../helpers/respuestas'

export const tiposExportacion = [
  {
    nombre: 'CSV',
    extension: 'csv',
    icono: 'mdi:file-delimited',
  },
  {
    nombre: 'Excel',
    extension: 'xlsx',
    icono: 'mdi:microsoft-excel',
  },
]

const ExportacionAvanzada = () => {
  const { fechaInicio, fechaTermino } = useSelector((state) => state.respuestas)
  const { nombreUsuario } = useSelector((state) => state.login)
  const [inicio, setInicio] = useState(fechaInicio)
  const [termino, setTermino] = useState(fechaTermino)
  const [email, setEmail] = useState('')
  const [exportando, setExportando] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [error, setError] = useState()
  const [indiceExtensionSeleccionado, setIndiceExtensionSeleccionado] =
    useState(0)
  const { tipos } = useSelector((state) => state.encuestas)
  const [idEncuestaSeleccionada, setIdEncuestaSeleccionada] = useState(
    tipos?.[0].id
  )
  const emailRef = useRef()
  const track = useAnalytics()

  const exportar = (e) => {
    e.preventDefault()
    if (exportando) {
      return
    }
    setExportando(true)
    try {
      exportarRespuestas(
        idEncuestaSeleccionada,
        inicio,
        termino,
        email,
        tiposExportacion[indiceExtensionSeleccionado].extension
      )
        .then(() => {
          track('Feedback', 'Reporte', 'exportar', {
            idEncuestaSeleccionada,
            inicio,
            termino,
            email,
            extension: tiposExportacion[indiceExtensionSeleccionado].extension,
          })
          setExportando(false)
          setModalVisible(true)
        })
        .catch((err) => setError(err))
    } catch (e) {
      setError(`Error: ${e.message}`)
    }
  }

  useEffect(() => emailRef.current?.focus(), [])

  useEffect(() => {
    if (termino < inicio) {
      setInicio(termino)
    }
  }, [inicio, termino])

  useEffect(() => track('Feedback', 'Reporte', 'index'), [track])

  useEffect(() => {
    if (inicio > termino) {
      setTermino(inicio)
    }
  }, [inicio, termino])

  if (!tipos) {
    return null
  }

  return (
    <div className="ExportacionAvanzada">
      {tiposExportacion.map((t, i) => (
        <Icon
          key={`preload-icono-${i}`}
          icon={t.icono}
          style={{ display: 'none' }}
        />
      ))}
      <ModalExportacionAvanzada
        email={email}
        visible={modalVisible}
        ocultar={() => setModalVisible(false)}
      />
      <div className="ExportacionAvanzada__contenedor">
        <div className="ExportacionAvanzada__tarjeta">
          <h1 className="ExportacionAvanzada__titulo">Reporte completo</h1>
          <div className="ExportacionAvanzada__explicacion">
            <p>
              Este módulo permite exportar la lista de chats de un servicio a
              una planilla de datos.
              <br />
              <br />
              Recibirás la planilla en el email ingresado.
            </p>
            <div className="ExportacionAvanzada__diagrama">
              <Icon
                icon={tiposExportacion[indiceExtensionSeleccionado].icono}
              />
              <Icon icon="mdi:arrow-right-thick" />
              <Icon onClick={() => emailRef.current.focus()} icon="mdi:email" />
            </div>
          </div>
          <form
            className="ExportacionAvanzada__contenedor_formulario"
            onSubmit={exportar}
          >
            <div className="ExportacionAvanzada__campo">
              <label className="ExportacionAvanzada__label" htmlFor="email">
                E-mail
              </label>
              <input
                className="ExportacionAvanzada__input"
                type="email"
                id="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                ref={emailRef}
                placeholder="Ingresa tu e-mail"
              />
            </div>
            <div className="ExportacionAvanzada__campo">
              <label className="ExportacionAvanzada__label" htmlFor="servicio">
                Servicio
              </label>
              <select
                id="servicio"
                onChange={(e) => setIdEncuestaSeleccionada(e.target.value)}
                className="ExportacionAvanzada__input"
              >
                {tipos.map((t) => (
                  <option key={`option-tipo-${t.id}`} value={t.id}>
                    {formatearNombreEncuesta(nombreUsuario, t.nombre)}
                  </option>
                ))}
              </select>
            </div>
            <div className="ExportacionAvanzada__campo">
              <label className="ExportacionAvanzada__label" htmlFor="periodo">
                Rango de fechas
              </label>
              <div className="ExportacionAvanzada__contenedor_rango">
                <ReactDatePicker
                  selected={inicio}
                  onChange={(f) => setInicio(f)}
                  dateFormat="d MMMM yyyy"
                  locale="es"
                  className="SelectorRangoFechas__datepicker"
                  required
                />
                -
                <ReactDatePicker
                  selected={termino}
                  onChange={(f) => setTermino(f)}
                  dateFormat="d MMMM yyyy"
                  locale="es"
                  className="SelectorRangoFechas__datepicker"
                  required
                />
              </div>
            </div>
            <div className="ExportacionAvanzada__campo">
              <label className="ExportacionAvanzada__label" htmlFor="periodo">
                Formato
              </label>
              <div className="ExportacionAvanzada__contenedor_rango">
                {tiposExportacion.map((tipo, i) => (
                  <label
                    key={`radio-exportacion-${i}`}
                    className="ExportacionAvanzada__label_option"
                  >
                    <input
                      onChange={() => setIndiceExtensionSeleccionado(i)}
                      type="radio"
                      radioGroup="formato"
                      checked={indiceExtensionSeleccionado === i}
                    />{' '}
                    {tipo.nombre}
                  </label>
                ))}
              </div>
            </div>
            <button
              className="ExportacionAvanzada__boton_exportar"
              type="submit"
              disabled={exportando}
            >
              {exportando ? (
                <>
                  <div className="ExportacionAvanzada__loader_exportando" />{' '}
                  Generando...
                </>
              ) : (
                <>Generar reporte</>
              )}
            </button>
            {error}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExportacionAvanzada
