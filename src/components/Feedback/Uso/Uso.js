import React from 'react'
import { useSelector } from 'react-redux'
import './Uso.css'

const Uso = () => {

  const { tipos } = useSelector(state => state.encuestas)

  return (
    <div className="Uso">
      <div className="Uso__superior">
        <h1 className="Uso__titulo">Uso</h1>
        <p className="Uso__explicacion">
          Los costos de aquí incluyen IVA o algo por el estilo, un mensaje explicativo amigable y buena onda.  
        </p>
      </div>
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
      <div className="Uso__contenedor_tabla">
        <table className="Uso__tabla_uso">
          <thead>
            <tr>
              <th>Encuesta</th>
              <th>Respuestas</th>
              <th>Costo</th>
            </tr>
          </thead>
          <tbody>
            <tr className="Uso__fila_todas">
              <td>Todas las encuestas</td>
              <td>1.000</td>
              <td>$20.500</td>
            </tr>
            {tipos.map(tipo => (
              <tr
                className="Uso__fila_tipo_encuesta"
                key={`uso-tipo-${tipo.nombre}`}
              >
                <td>➟ {tipo.nombre}</td>
                <td>{Math.floor(Math.random() * 15)}</td>
                <td>${Math.floor(Math.random() * 1500)}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default Uso
