import React, { useState, useEffect } from 'react'
import './LoaderRespuestas.css'

const LoaderRespuestas = () => {

  const [sufijo, setSufijo] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setSufijo(s => (s + 1) % 4), 250)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="LoaderRespuestas">
      <div className="LoaderRespuestas__mensaje">
        Cargando respuestas{Array(sufijo).fill('.').join('')}
      </div>
    </div>
  )
}

export default LoaderRespuestas
