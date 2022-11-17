import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import useAnalytics from '../../../hooks/useAnalytics'
import './Busqueda.css'
import CuadroBusqueda from './CuadroBusqueda'
import ResultadosBusqueda from './ResultadosBusqueda'

const Busqueda = () => {

  const { termino } = useParams()
  const { resultadosBusqueda } = useSelector(state => state.busqueda)
  const track = useAnalytics()

  useEffect(() => track('Feedback', 'Busqueda', 'index'), [track])

  return (
    <div className="Busqueda">
      <div className="Busqueda__superior">
        {termino && resultadosBusqueda?.length > 0 &&
          <>
            <div className="Busqueda__cover" />
            <div className="Busqueda__sombra" />
          </>
        }
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
