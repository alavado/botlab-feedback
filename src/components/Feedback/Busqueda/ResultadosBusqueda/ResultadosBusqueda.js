import React from 'react'
import { useSelector } from 'react-redux'
import ResultadoBusqueda from './ResultadoBusqueda'
import './ResultadosBusqueda.css'

const ResultadosBusqueda = () => {

  const { resultadosBusqueda } = useSelector(state => state.busqueda)

  console.log(resultadosBusqueda)

  return (
    <div className="ResultadosBusqueda">
      {resultadosBusqueda.map((r, i) => (
        <ResultadoBusqueda
          key={`resultado-busqueda-${i}`}
          resultado={r}
        />
      ))}
    </div>
  )
}

export default ResultadosBusqueda
