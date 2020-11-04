import React from 'react'
import './Buscador.css'
import CuadroBusqueda from './CuadroBusqueda'

const Buscador = () => {
  return (
    <div className="Buscador">
      <div className="Buscador__superior">
        <h1 className="Buscador__titulo">Búsqueda</h1>
      </div>
      <div className="Buscador__contenedor">
        <CuadroBusqueda />
      </div>
    </div>
  )
}

export default Buscador
