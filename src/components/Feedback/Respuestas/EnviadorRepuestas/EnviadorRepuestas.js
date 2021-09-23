import { InlineIcon } from '@iconify/react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaEnviador } from '../../../../redux/ducks/enviador'
import iconoContacto from '@iconify/icons-mdi/send'
import { useMutation, useQuery } from 'react-query'
import './EnviadorRepuestas.css'
import { consultarMapping, crearEncuestas } from '../../../../api/endpoints'
import { useState } from 'react'

const obtenerTipoInput = header => {
  switch (header.type) {
    case 'text':
      return 'text'
    case 'datetime':
      if (header.display_name.toLowerCase().includes('hora')) {
        return 'time'
      }
      return 'date'
    default:
      return header.type
  }
}

const EnviadorRepuestas = ({ idEncuesta }) => {

  const { activo } = useSelector(state => state.enviador)
  const dispatch = useDispatch()
  const [filas, setFilas] = useState([])
  const { isLoading, isError, data } = useQuery(
    `inputHeaders-${idEncuesta}`,
    consultarMapping(idEncuesta),
    { refetchOnWindowFocus: false }
  )
  const mutate = useMutation(crearEncuestas)

  console.log(data)

  if (!activo) {
    return null
  }

  const enviarEncuestas = e => {
    e.preventDefault()
    console.log(filas)
  }

  const headersMenosConsultaConfirmacion = data.data.data.filter(h => h.type !== 'true')

  return createPortal(
    <div
      className="EnviadorRepuestas"
      onClick={() => dispatch(desactivaEnviador())}
    >
      {isLoading
        ? <p>Cargando...</p>
        : <div
            className="EnviadorRespuestas__contenedor"
            onClick={e => e.stopPropagation()}
          >
            <div className="EnviadorRespuestas__superior">
              <h1>Contacto de usuarios</h1>
              <div>
                <button onClick={() => setFilas([...filas, [...headersMenosConsultaConfirmacion].fill('')])}>Agregar usuario</button>
                <input id="csv-enviador" type="file" />
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
                    </tr>
                  </thead>
                  <tbody>
                    {filas.length > 0
                      ? filas.map((fila, i) => (
                          <tr key={`fila-enviador-${i}`}>
                            {fila.map((_, j) => (
                              <td key={`campo-enviador-${i}-${j}`}>
                                <input
                                  className="Enviador__input"
                                  type={obtenerTipoInput(headersMenosConsultaConfirmacion[j])}
                                  onChange={e => setFilas(filas => { filas[i][j] = e.target.value; return filas })}
                                  required={headersMenosConsultaConfirmacion[j].required}
                                />
                              </td>
                            ))}
                          </tr>
                        ))
                      : <tr>
                          <td className="EnviadorRespuestas__mensaje_sin_datos" colSpan={data.data.data.length}>
                          Puedes agregar usuarios desde un archivo o manualmente
                          </td>
                        </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div className="EnviadorRespuestas__contenedor_acciones">
                <button className="EnviadorRespuestas__boton_enviar">
                  <InlineIcon icon={iconoContacto} /> Contactar usuarios
                </button>
              </div>
            </form>
          </div>
      }
    </div>
  , document.getElementById('modal-enviador-respuestas'))
}

export default EnviadorRepuestas