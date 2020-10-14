import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { headersRespuestas as headersAPI } from '../../../../api/endpoints'
import { guardaHeadersEncuesta } from '../../../../redux/ducks/encuestas'
import './SelectorEncuesta.css'

const SelectorEncuesta = () => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  const verEncuesta = useCallback(async id => {
    try {
      const data = await headersAPI(id)
      dispatch(guardaHeadersEncuesta(id, data))
    } catch (e) {
      console.error('un error', e)
    }
  }, [dispatch])

  return (
    <div className="SelectorEncuesta">
      <select onChange={e => verEncuesta(e.target.value)}>
        {tipos.map(({ id, nombre }) => (
          <option
            key={`boton-${id}`}
            value={id}
          >
            {nombre}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectorEncuesta
