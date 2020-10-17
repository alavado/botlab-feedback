import React from 'react'
import './LoaderRespuestas.css'

const LoaderRespuestas = () => {
  return (
    <div className="LoaderRespuestas">
      <div className="LoaderRespuestas__loader" />
      <div className="LoaderRespuestas__mensaje">
        Cargando respuestas...
      </div>
    </div>
  )
}

export default LoaderRespuestas
