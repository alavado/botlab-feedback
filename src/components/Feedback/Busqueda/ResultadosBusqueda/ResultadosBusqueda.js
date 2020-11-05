import React from 'react'
import { useSelector } from 'react-redux'
import './ResultadosBusqueda.css'

const ResultadosBusqueda = () => {

  const { resultadosBusqueda } = useSelector(state => state.busqueda)

  console.log(resultadosBusqueda)

  return (
    <div className="ResultadosBusqueda">
      
    </div>
  )
}

export default ResultadosBusqueda
