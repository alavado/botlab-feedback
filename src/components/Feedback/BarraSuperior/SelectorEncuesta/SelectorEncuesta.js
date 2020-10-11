import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { headersRespuestas as headersAPI } from '../../../../api/endpoints'
import { guardaHeadersEncuesta } from '../../../../redux/ducks/encuestas'
import './SelectorEncuesta.css'

const SelectorEncuesta = () => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  const verEncuesta = async id => {
    try {
      const data = await headersAPI(id)
      dispatch(guardaHeadersEncuesta(id, data))
    } catch (e) {
      console.error('un error', e)
    }
  }

  return (
    <div className="SelectorEncuesta">
      {tipos.map(({ id, nombre }) => (
        <button
          key={`boton-${id}`}
          onClick={() => verEncuesta(id)}
        >
          Ver encuesta {nombre}
        </button>
      ))}
    </div>
  )
}

export default SelectorEncuesta
