import React from 'react'
import './LoaderResultadosBusqueda.css'

const LoaderResultadosBusqueda = () => {
  return (
    <div className="LoaderResultadosBusqueda">
      <div className="LoaderResultadosBusqueda__loader" />
      <div className="LoaderResultadosBusqueda__mensaje">
        Buscando...
      </div>
    </div>
  )
}

export default LoaderResultadosBusqueda
