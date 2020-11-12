import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { busqueda as busquedaAPI } from '../../../../api/endpoints'
import { comienzaBusqueda, guardaResultadosBusqueda, guardaTermino } from '../../../../redux/ducks/busqueda'
import './CuadroBusqueda.css'

const CuadroBusqueda = () => {

  const inputRef = useRef()
  const [termino, setTermino] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const buscar = e => {
    e.preventDefault()
    dispatch(comienzaBusqueda())
    busquedaAPI(termino)
      .then(res => {
        dispatch(guardaTermino(termino))
        dispatch(guardaResultadosBusqueda(res.data))
      })
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
          value={termino}
          onChange={e => setTermino(e.target.value)}
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
