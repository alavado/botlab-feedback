import { InlineIcon } from '@iconify/react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaEnviador } from '../../../../redux/ducks/enviador'
import { useMutation, useQuery } from 'react-query'
import './EnviadorRepuestas.css'
import { consultarMapping, crearEncuestas } from '../../../../api/endpoints'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { ESQUEMA_OSCURO } from '../../../../redux/ducks/opciones'
import { parse as parseCSV } from 'papaparse'
import _, { some } from 'lodash'
import { guardaRangoFechas, normalizar } from '../../../../redux/ducks/respuestas'
import { format, parseISO } from 'date-fns'

const obtenerTipoInput = header => {
  switch (header.type) {
    case 'text':
      return 'text'
    case 'datetime':
      if (header.display_name.toLowerCase().startsWith('hora')) {
        return 'time'
      }
      return 'date'
    default:
      return header.type
  }
}

const formatearCampo = (header, valor) => {
  if (header.display_name === 'FONO') {
    return valor.replace(/[^0-9]/g, '')
  }
  else if (obtenerTipoInput(header) === 'date') {
    return format(parseISO(valor), 'yyyy-MM-dd')
  }
  return valor
}

const ENVIADOR_ESTADO_PENDIENTE = 'ENVIADOR_ESTADO_PENDIENTE'
const ENVIADOR_ESTADO_ENVIADO = 'ENVIADOR_ESTADO_ENVIADO'

const EnviadorRepuestas = ({ idEncuesta }) => {

  const { activo } = useSelector(state => state.enviador)
  const { esquema } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  const [filas, setFilas] = useState([])
  const { isLoading, data } = useQuery(
    `inputHeaders-${idEncuesta}`,
    consultarMapping(idEncuesta),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  )
  const { mutate, isLoading: enviando } = useMutation(crearEncuestas, {
    onSuccess: data => {
      const logsRespuesta = data.data.data.logs
      const conteoPacientesAContactar = filas.length
      const conteoPacientesNoContactados = logsRespuesta.filter(r => r.logs.some(l => l.type === 'ERROR')).length
      setFilas(filas.map((f, i) => {
        const logs = logsRespuesta.find(l => l.row_index === i)?.logs
        if (logs) {
          if (logs.some(l => l.type === 'ERROR')) {
            return { ...f, logs, estado: ENVIADOR_ESTADO_PENDIENTE }
          }
          else {
            return { ...f, logs, estado: ENVIADOR_ESTADO_ENVIADO }
          }
        }
        return _.omit({ ...f, estado: ENVIADOR_ESTADO_ENVIADO }, ['logs'])
      }))
      if (conteoPacientesAContactar > conteoPacientesNoContactados) {
        dispatch(guardaRangoFechas([Date.now(), Date.now()]))
      }
    },
    onError: error => {
      console.log(error)
    }
  })

  useEffect(() => setFilas([]), [idEncuesta])

  if (!activo) {
    return null
  }

  const enviarEncuestas = e => {
    e.preventDefault()
    const ahora = format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
    const datos = filas.map(f => headersSinConsultaConfirmacion.reduce((obj, h, i) => (
      {
        ...obj,
        [h.display_name]: formatearCampo(h, f.datos[i])
      }
    ), { 'Consulta confirmación': ahora }))
    mutate({ idEncuesta, datos })
  }

  const headersSinConsultaConfirmacion = [{ name: 'FONO', type: 'text', display_name: 'FONO', required: true }, ...data.data.data.filter(h => h.type !== 'true')]

  const procesarArchivo = e => {
    parseCSV(e.target.files[0], {
      header: true,
      transformHeader: h => {
        if (normalizar(h) === normalizar('telefono')) {
          return 'fono'
        }
        return normalizar(h)
      },
      complete: ({ data }) => {
        setFilas(filas => [
          ...filas,
          ...data.map(fila => {
            const datos = headersSinConsultaConfirmacion.map(h => fila[normalizar(h.display_name)] || '')
            return some(datos)
              ? { datos, estado: ENVIADOR_ESTADO_PENDIENTE }
              : null
          }).filter(x => x)
        ])
      }
    })
    document.getElementById('csv-enviador').value = ''
  }

  const abrirDialogoArchivo = () => document.getElementById('csv-enviador').click()
  const agregarFilaVacía = () => setFilas([...filas, { datos: [...headersSinConsultaConfirmacion].fill(''), estado: ENVIADOR_ESTADO_PENDIENTE }])
  const filasPendientes = filas.filter(f => f.estado === ENVIADOR_ESTADO_PENDIENTE)
  const textoBotonContactar = filasPendientes.length ? `Contactar ${filasPendientes.length} paciente${filasPendientes.length > 1 ? 's' : ''}` : `No hay pacientes por contactar`

  return createPortal(
    <div
      className={classNames({
        "EnviadorRepuestas": true,
        "EnviadorRespuestas__oscuro": esquema === ESQUEMA_OSCURO
      })}
      onClick={() => dispatch(desactivaEnviador())}
    >
      {isLoading
        ? <p>Cargando...</p>
        : <div
            className="EnviadorRespuestas__contenedor"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="EnviadorRespuestas__boton_cerrar"
              onClick={() => dispatch(desactivaEnviador())}
              title="Cerrar"
            >
              <InlineIcon icon="mdi:close" />
            </button>
            <div className="EnviadorRespuestas__superior">
              <h1 className="EnviadorRespuestas__titulo">Contactar pacientes</h1>
              <div className="EnviadorRespuestas__superior_acciones">
                <button
                  className="EnviadorRespuestas__boton_accion"
                  onClick={agregarFilaVacía}
                >
                  <InlineIcon icon="mdi:table-row-add-after" /> Agregar paciente
                </button>
                <button
                  className="EnviadorRespuestas__boton_accion"
                  onClick={abrirDialogoArchivo}
                >
                  <InlineIcon icon="mdi:table-import" /> Cargar desde archivo
                </button>
                {/* <button
                  className="EnviadorRespuestas__boton_accion"
                  onClick={() => setFilas([])}
                >
                  <InlineIcon icon={iconoLimpiarTabla} /> Limpiar tabla
                </button> */}
                <input
                  style={{ display: 'none' }}
                  id="csv-enviador"
                  type="file"
                  accept=".csv"
                  onChange={procesarArchivo}
                />
              </div>
            </div>
            <form
              onSubmit={enviarEncuestas}
              className="EnviadorRespuestas__formulario"
            >
              <div className="EnviadorRespuestas__contenedor_tabla">
                <table className="EnviadorRespuestas__tabla">
                  <thead>
                    <tr>
                      <th></th>
                      {headersSinConsultaConfirmacion.map(({ display_name }) => (
                        <th key={`header-enviador-${display_name}`}>
                          {display_name}
                        </th>
                      ))}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.length > 0
                      ? filas.map((fila, i) => (
                          <tr
                            key={`fila-enviador-${i}`}
                            className={classNames({
                              "EnviadorRespuestas__fila--enviada": fila.estado === ENVIADOR_ESTADO_ENVIADO
                            })}
                          >
                            <td>
                              <span className="EnviadorRespuestas__indice_fila">
                                {fila.logs && (
                                  <>
                                    {fila.logs.some(l => l.type === 'ERROR') ? '🔴' : '🟢'}
                                    <div className="EnviadorRespuestas__contenedor_logs">
                                      {fila.logs.map(log => <div>{log.type === 'ERROR' ? '🔴' : '🟣'} {log.log}</div>)}
                                    </div>
                                  </>
                                )}
                                {i + 1}
                              </span>
                            </td>
                            {fila.datos.map((v, j) => (
                              <td key={`campo-enviador-${i}-${j}`}>
                                <input
                                  className={classNames({
                                    "EnviadorRespuestas__input": true,
                                    "EnviadorRespuestas__input--enviado": fila.estado === ENVIADOR_ESTADO_ENVIADO
                                  })}
                                  type={obtenerTipoInput(headersSinConsultaConfirmacion[j])}
                                  onChange={e => {
                                    setFilas([
                                      ...filas.slice(0, i),
                                      {
                                        ...filas[i],
                                        datos: filas[i].datos.map((v, k) => k === j ? e.target.value : v),
                                        estado: ENVIADOR_ESTADO_PENDIENTE,
                                        logs: undefined
                                      },
                                      ...filas.slice(i + 1)
                                    ])
                                  }}
                                  required={headersSinConsultaConfirmacion[j].required}
                                  value={v}
                                />
                              </td>
                            ))}
                            <td>
                              <button
                                className="Enviador__boton_accion_fila"
                                type="button"
                                onClick={() => setFilas(filas => filas.filter((_, k) => k !== i))}
                              >
                                Borrar fila
                              </button>
                            </td>
                          </tr>
                        ))
                      : <tr>
                          <td className="EnviadorRespuestas__mensaje_sin_datos" colSpan={data.data.data.length + 2}>
                          Puedes agregar pacientes desde un <span className="EnviadorRespuestas__link" onClick={abrirDialogoArchivo}>archivo CSV</span> o <span className="EnviadorRespuestas__link" onClick={agregarFilaVacía}>manualmente</span>
                          </td>
                        </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="EnviadorRespuestas__contenedor_acciones">
                <button
                  className="EnviadorRespuestas__boton_enviar"
                  disabled={!filasPendientes.length}
                  type="submit"
                >
                  <InlineIcon icon="mdi:send" /> {enviando ? 'Contactando...' : textoBotonContactar}
                </button>
              </div>
            </form>
          </div>
      }
    </div>
  , document.getElementById('modal-enviador-respuestas'))
}

export default EnviadorRepuestas