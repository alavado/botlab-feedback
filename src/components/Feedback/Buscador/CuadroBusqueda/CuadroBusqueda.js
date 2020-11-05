import React, { useEffect, useRef } from 'react'
import './CuadroBusqueda.css'

const CuadroBusqueda = () => {

  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const buscar = e => {
    e.preventDefault()
  }

  return (
    <div className="CuadroBusqueda">
      <form
        className="CuadroBusqueda__formulario"
        onSubmit={buscar}
      >
        <input
          className="CuadroBusqueda__input"
          type="text"
          spellCheck="false"
          ref={inputRef}
        />
        <button
          type="submit"
          className="CuadroBusqueda__boton_buscar"
        >
          Buscar
        </button>
      </form>
      <p className="CuadroBusqueda__explicacion">
        La búsqueda entrega hasta 100 resultados más relevantes de cualquier encuesta asociada al término ingresado.
        Los resultados pueden tener un desfase de hasta 15 minutos.
      </p>
    </div>
  )
}

export default CuadroBusqueda
