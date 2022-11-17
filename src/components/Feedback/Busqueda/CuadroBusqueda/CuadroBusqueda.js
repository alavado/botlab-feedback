import { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import './CuadroBusqueda.css'
import { Icon } from '@iconify/react'
import { useDispatch } from 'react-redux'
import { limpiaBusqueda } from '../../../../redux/ducks/busqueda'
import useAnalytics from '../../../../hooks/useAnalytics'

const CuadroBusqueda = () => {

  const inputRef = useRef()
  const [termino, setTermino] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()
  const track = useAnalytics()

  useEffect(() => {
    inputRef.current.focus()
    dispatch(limpiaBusqueda())
  }, [dispatch])

  const buscar = e => {
    e.preventDefault()
    track('Feedback', 'Busqueda', 'buscar', { termino })
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
          icon="mdi:search"
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
        Este módulo busca en todos los servicios y cualquier fecha, entregando los resultados más relevantes.<br /><br />
        Puedes buscar por RUT, nombre, teléfono o cualquier otro dato de las citas.
      </p>
    </div>
  )
}

export default CuadroBusqueda
