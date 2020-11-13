import React from 'react'
import { useParams } from 'react-router-dom'
import './Busqueda.css'
import CuadroBusqueda from './CuadroBusqueda'
import ResultadosBusqueda from './ResultadosBusqueda'

const Busqueda = () => {

  const { termino } = useParams()

  return (
    <div className="Busqueda">
      <div className="Busqueda__superior">
        <h1 className="Busqueda__titulo">Búsqueda</h1>
      </div>
      <div className="Busqueda__contenedor">
        {termino
        ? <ResultadosBusqueda />
        : <CuadroBusqueda />}
      </div>
    </div>
  )
}

export default Busqueda
