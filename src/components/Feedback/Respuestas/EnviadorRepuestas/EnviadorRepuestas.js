import { InlineIcon } from '@iconify/react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaEnviador } from '../../../../redux/ducks/enviador'
import iconoContacto from '@iconify/icons-mdi/send'
import { useQuery } from 'react-query'
import './EnviadorRepuestas.css'
import { inputHeaders } from '../../../../api/endpoints'

const EnviadorRepuestas = () => {

  const { activo } = useSelector(state => state.enviador)
  const { idEncuestaSeleccionada: idEncuesta } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()
  const { isLoading, isError, data } = useQuery('inputHeaders', inputHeaders(idEncuesta), { refetchOnWindowFocus: false })

  console.log(data)

  if (!activo) {
    return null
  }

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
                <input id="csv-enviador" type="file" />
              </div>
            </div>
            <div className="EnviadorRespuestas__contenedor_tabla">
              <table className="EnviadorRespuestas__tabla">
                <thead>
                  {data.data.data.map(({ display_name }) => (
                    <th key={`header-enviador-${display_name}`}>
                      {display_name}
                    </th>
                  ))}
                </thead>
                <tbody>
                  <tr>
                    <td className="EnviadorRespuestas__mensaje_sin_datos" colSpan={data.data.data.length}>
                      Agrega usuarios desde un archivo o manualmente
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="EnviadorRespuestas__contenedor_acciones">
              <button className="EnviadorRespuestas__boton_enviar">
                <InlineIcon icon={iconoContacto} /> Contactar usuarios
              </button>
            </div>
          </div>
      }
    </div>
  , document.getElementById('modal-enviador-respuestas'))
}

export default EnviadorRepuestas