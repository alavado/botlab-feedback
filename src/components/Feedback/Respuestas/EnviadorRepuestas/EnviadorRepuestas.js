import { InlineIcon } from '@iconify/react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaEnviador } from '../../../../redux/ducks/enviador'
import iconoContacto from '@iconify/icons-mdi/send'
import iconoCerrar from '@iconify/icons-mdi/close'
import { useMutation, useQuery } from 'react-query'
import './EnviadorRepuestas.css'
import { consultarMapping, crearEncuestas } from '../../../../api/endpoints'
import { useState } from 'react'
import classNames from 'classnames'
import { ESQUEMA_OSCURO } from '../../../../redux/ducks/opciones'
import { parse as parseCSV } from 'papaparse'
import { some } from 'lodash'
import { normalizar } from '../../../../redux/ducks/respuestas'
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
    console.log(valor)
    return format(parseISO(valor), 'yyyy-MM-dd')
  }
  return valor
}

const EnviadorRepuestas = ({ idEncuesta }) => {

  const { activo } = useSelector(state => state.enviador)
  const { esquema } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  const [filas, setFilas] = useState([])
  const { isLoading, isError, data } = useQuery(
    `inputHeaders-${idEncuesta}`,
    consultarMapping(idEncuesta),
    { refetchOnWindowFocus: false }
  )
  const { mutate } = useMutation(crearEncuestas)

  if (!activo) {
    return null
  }

  const enviarEncuestas = e => {
    e.preventDefault()
    const ahora = format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
    const datos = filas.map(f => headersMenosConsultaConfirmacion.reduce((obj, h, i) => (
      {
        ...obj,
        [h.display_name]: formatearCampo(h, f[i])
      }
    ), { 'Consulta confirmación': ahora }))
    console.log(datos)
    mutate({ idEncuesta, datos })
  }

  const headersMenosConsultaConfirmacion = [{ name: 'FONO', type: 'text', display_name: 'FONO', required: true }, ...data.data.data.filter(h => h.type !== 'true')]

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
            const valores = headersMenosConsultaConfirmacion.map(h => fila[normalizar(h.display_name)] || '')
            return some(valores)
              ? valores
              : null
          }).filter(x => x)
        ])
      }
    })
    document.getElementById('csv-enviador').value = ''
  }

  const abrirDialogoArchivo = () => document.getElementById('csv-enviador').click()
  const agregarFilaVacía = () => setFilas([...filas, [...headersMenosConsultaConfirmacion].fill('')])

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
              <InlineIcon icon={iconoCerrar} />
            </button>
            <div className="EnviadorRespuestas__superior">
              <h1>Contacto de usuarios</h1>
              <div className="EnviadorRespuestas__superior_acciones">
                <button className="EnviadorRespuestas__boton_accion" onClick={agregarFilaVacía}>Agregar fila</button>
                <button className="EnviadorRespuestas__boton_accion" onClick={abrirDialogoArchivo}>Cargar archivo</button>
                <button className="EnviadorRespuestas__boton_accion" onClick={() => setFilas([])}>Limpiar tabla</button>
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
                      {headersMenosConsultaConfirmacion.map(({ display_name }) => (
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
                          <tr key={`fila-enviador-${i}`}>
                            {fila.map((v, j) => (
                              <td key={`campo-enviador-${i}-${j}`}>
                                <input
                                  className="Enviador__input"
                                  type={obtenerTipoInput(headersMenosConsultaConfirmacion[j])}
                                  onChange={e => {
                                    setFilas([...filas.slice(0, i), filas[i].map((v, k) => k === j ? e.target.value : v), ...filas.slice(i + 1)])
                                  }}
                                  required={headersMenosConsultaConfirmacion[j].required}
                                  value={v}
                                />
                              </td>
                            ))}
                            <td><button type="button" onClick={() => setFilas(filas => filas.filter((_, k) => k !== i))}>Borrar fila</button></td>
                          </tr>
                        ))
                      : <tr>
                          <td className="EnviadorRespuestas__mensaje_sin_datos" colSpan={data.data.data.length}>
                          Puedes agregar usuarios desde un <span onClick={abrirDialogoArchivo}>archivo</span> CSV o <span onClick={agregarFilaVacía}>manualmente</span>
                          </td>
                        </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="EnviadorRespuestas__contenedor_acciones">
                <button
                  className="EnviadorRespuestas__boton_enviar"
                  disabled={!filas.length}
                  type="submit"
                >
                  <InlineIcon icon={iconoContacto} /> {filas.length ? <>Contactar {filas.length} usuario{filas.length > 1 ? 's' : ''}</> : <>No hay usuarios</>}
                </button>
              </div>
            </form>
          </div>
      }
    </div>
  , document.getElementById('modal-enviador-respuestas'))
}

export default EnviadorRepuestas