import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import './ResultadoBusqueda.css'

const ResultadoBusqueda = ({ resultado }) => {

  const history = useHistory()
  const dispatch = useDispatch()

  const verChat = resultado => {
    dispatch(guardaEstaRespuesta(resultado))
    history.push(`/chat/${resultado.poll_id}/${resultado.user_id}`)
  }

  return (
    <div className="ResultadoBusqueda" onClick={() => verChat(resultado)}>
      <table>
        <thead>
          <tr>
            {Object.keys(resultado).map((k, i) => (
              <th
                key={`${resultado.user_id}-${i}`}
                className="ResultadoBusqueda__encabezado"
              >
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(resultado).map((k, i) => (
              <td
                key={`${resultado.user_id}-v-${i}`}
                className="ResultadoBusqueda__valor"
              >
                {typeof resultado[k] === 'object' ? resultado[k].tag : resultado[k]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ResultadoBusqueda
