import React from 'react'
import './Uso.css'

const Uso = () => {
  return (
    <div className="Uso">
      <h1 className="Uso__titulo">Uso</h1>
      <p className="Uso__explicacion">Costs listed here may exclude taxes, fees, support fees, expert services costs, and certain other products.</p>
      <div className="Uso__encabezado">
        <select className="Uso__selector_periodo">
          <option>Diciembre 2020</option>
          <option>Noviembre 2020</option>
          <option>Octubre 2020</option>
        </select>
        <div className="Uso__actualizacion">
          Actualización: 1 de marzo de 2020, 10:15
        </div>
      </div>
      <table className="Uso__tabla_uso">
        <thead>
          <tr>
            <th>Encuesta</th>
            <th>Respuestas</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Todas las encuestas</td>
            <td>1.000</td>
            <td>$20.500</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Uso
