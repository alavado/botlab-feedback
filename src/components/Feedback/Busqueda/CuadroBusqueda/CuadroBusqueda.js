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
      <div className="CuadroBusqueda__tarjeta">
        <h1 className="CuadroBusqueda__titulo">Búsqueda general</h1>
        <div className="CuadroBusqueda__explicacion">
          <p>
            Este módulo busca los chats más relevantes en todos los servicios y cualquier fecha.<br /><br />
            Puedes buscar por RUT, nombre, teléfono o cualquier otro dato de las citas.
          </p>
          <div className="ExportacionAvanzada__diagrama">
            <Icon icon="mdi:account-box-multiple" />
            <Icon icon="mdi:search" />
          </div>
        </div>
        <form
          className="CuadroBusqueda__formulario"
          onSubmit={buscar}
        >
          <div className="CuadroBusqueda__contenedor_input">
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
          </div>
          <button
            type="submit"
            className="CuadroBusqueda__boton_buscar"
          >
            Buscar
          </button>
        </form>
      </div>
    </div>
  )
}

export default CuadroBusqueda
