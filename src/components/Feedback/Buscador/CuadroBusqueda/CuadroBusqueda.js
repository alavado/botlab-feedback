import React from 'react'
import './CuadroBusqueda.css'

const CuadroBusqueda = () => {
  return (
    <div className="CuadroBusqueda">
      <input
        className="CuadroBusqueda__input"
        type="text"
        spellCheck="false"
      />
      <button className="CuadroBusqueda__boton_buscar">
        Buscar
      </button>
      <p className="CuadroBusqueda__explicacion">
        La búsqueda entrega hasta 100 resultados más relevantes de cualquier encuesta asociada a la cuenta del usuario.
        Los resultados entregados pueden tener un desfase de hasta 15 minutos.
      </p>
    </div>
  )
}

export default CuadroBusqueda
