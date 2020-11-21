import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import './Busqueda.css'
import CuadroBusqueda from './CuadroBusqueda'
import ResultadosBusqueda from './ResultadosBusqueda'

const Busqueda = () => {

  const { termino } = useParams()
  const { resultadosBusqueda } = useSelector(state => state.busqueda)

  return (
    <div className="Busqueda">
      <div className="Busqueda__superior">
        {termino && resultadosBusqueda?.length > 0 &&
          <>
            <div className="Busqueda__cover" />
            <div className="Busqueda__sombra" />
          </>
        }
        <h1 className="Busqueda__titulo">Búsqueda</h1>
      </div>
      <div className="Busqueda__contenedor">
        {termino
          ? <ResultadosBusqueda />
          : <CuadroBusqueda />
        }
      </div>
    </div>
  )
}

export default Busqueda
