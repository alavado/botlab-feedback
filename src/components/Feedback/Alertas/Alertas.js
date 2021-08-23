import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import iconoAlerta from '@iconify/icons-mdi/circle'
import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import './Alertas.css'
import { es } from 'date-fns/locale'

const Alertas = () => {

  const { alertas } = useSelector(state => state.alertas)
  const history = useHistory()

  return (
    <div className="Alertas">
      <div className="Alertas__superior">
        <h1 className="Alertas__titulo">Alertas</h1>
        <div className="Alertas__contenedor_tabla">
          <table className="Alertas__tabla">
            <thead>
              <tr>
                <th></th>
                {/* <th>timestamp</th> */}
                <th>Fecha</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((a, i) => (
                <tr
                  key={`fila-alerta-${i}`}
                  onClick={() => history.push(`/chat/${a.poll_id}/${a.user_id}`)}
                  className={classNames({
                    'Alertas__fila_alerta': true,
                    'Alertas__fila_alerta--vista': i > 5
                  })}
                >
                  <td>
                    <InlineIcon
                      className="Alertas__icono"
                      icon={iconoAlerta}
                    />
                  </td>
                  {/* <td>{a.timestamp}</td> */}
                  <td>{format(parseISO(a.timestamp_sent), 'd MMM yyyy \'a las\' HH:mm', { locale: es })}</td>
                  <td>{a.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Alertas
