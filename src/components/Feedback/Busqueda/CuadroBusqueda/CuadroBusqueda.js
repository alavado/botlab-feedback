import { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import iconoBuscar from '@iconify/icons-mdi/search'
import './CuadroBusqueda.css'
import { Icon } from '@iconify/react'
import { useDispatch } from 'react-redux'
import { limpiaBusqueda } from '../../../../redux/ducks/busqueda'

const CuadroBusqueda = () => {

  const inputRef = useRef()
  const [termino, setTermino] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    inputRef.current.focus()
    dispatch(limpiaBusqueda())
  }, [dispatch])

  const buscar = e => {
    e.preventDefault()
    history.push(`/busqueda/${termino}`)
  }

  return (
    <div className="CuadroBusqueda">
      <canvas style={{ border: '1px solid grey', display: 'none' }} id="mycanvas" />
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
          placeholder="RUT, nombre, teléfono..."
        />
        <Icon
          icon={iconoBuscar}
          className="CuadroBusqueda__icono_buscar"
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
