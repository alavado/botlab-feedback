import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Alertas.css'

const Alertas = () => {

  const { alertas } = useSelector(state => state.alertas)
  const history = useHistory()

  return (
    <div className="Alertas">
      <div className="Alertas__superior">
        <h1 className="Alertas__titulo">Alertas</h1>
        <table className="Alertas__tabla">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>timestamp_sent</th>
              <th>message</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((a, i) => (
              <tr
                key={`fila-alerta-${i}`}
                onClick={() => history.push(`/chat/${a.poll_id}/${a.user_id}`)}
              >
                <td>{a.timestamp}</td>
                <td>{a.timestamp_sent}</td>
                <td>{a.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Alertas
