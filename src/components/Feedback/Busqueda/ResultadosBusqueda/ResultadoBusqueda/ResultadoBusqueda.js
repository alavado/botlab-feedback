import React from 'react'
import { useSelector } from 'react-redux'
import './ResultadoBusqueda.css'

const ResultadoBusqueda = ({ resultado }) => {

  const { encuestas } = useSelector(state => state.encuestas)

  console.log(encuestas)

  return (
    <div className="ResultadoBusqueda">
      {Object.keys(resultado).map((k, i) => (
        <div
          key={`${resultado.user_id}-${i}`}
          className="ResultadoBusqueda__encabezado"
        >
          {k}
        </div>
      ))}
      {Object.keys(resultado).map((k, i) => (
        <div
          key={`${resultado.user_id}-v-${i}`}
          className="ResultadoBusqueda__valor"
        >
          {typeof resultado[k] === 'object' ? resultado[k].tag : resultado[k]}
        </div>
      ))}
    </div>
  )
}

export default ResultadoBusqueda
