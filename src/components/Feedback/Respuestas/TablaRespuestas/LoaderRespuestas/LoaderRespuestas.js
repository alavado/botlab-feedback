import React, { useState, useEffect } from 'react'
import './LoaderRespuestas.css'

const LoaderRespuestas = () => {

  const [puntitos, setPuntitos] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setPuntitos(s => (s + 1) % 4), 250)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="LoaderRespuestas">
      <div className="LoaderRespuestas__mensaje">
        Cargando respuestas{Array(puntitos).fill('.').join('')}
      </div>
    </div>
  )
}

export default LoaderRespuestas
