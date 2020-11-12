import React from 'react'
import { useSelector } from 'react-redux'
import './Busqueda.css'
import CuadroBusqueda from './CuadroBusqueda'
import ResultadosBusqueda from './ResultadosBusqueda'

const Busqueda = () => {

  const { resultadosBusqueda, buscando } = useSelector(state => state.busqueda)

  return (
    <div className="Busqueda">
      <div className="Busqueda__superior">
        <h1 className="Busqueda__titulo">Búsqueda</h1>
      </div>
      <div className="Busqueda__contenedor">
        {resultadosBusqueda || buscando
        ? <ResultadosBusqueda />
        : <CuadroBusqueda />}
      </div>
    </div>
  )
}

export default Busqueda
