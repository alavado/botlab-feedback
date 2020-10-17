import React, { useRef } from 'react'
import Icon from '@iconify/react'
import iconoBuscar from '@iconify/icons-mdi/search'
import './BuscadorRespuestas.css'
import { useDispatch } from 'react-redux'
import { buscaEsto } from '../../../../redux/ducks/respuestas'

const BuscadorRespuestas = () => {

  const refInput = useRef()
  const dispatch = useDispatch()

  return (
    <div className="BuscadorRespuestas">
      <div
        className="BuscadorRespuestas__contenedor_icono"
        onClick={() => refInput.current.focus()}
      >
        <Icon
          icon={iconoBuscar}
          className="BuscadorRespuestas__icono"
        />
      </div>
      <input
        ref={refInput}
        className="BuscadorRespuestas__input"
        onChange={e => dispatch(buscaEsto(e.target.value))}
      />
    </div>
  )
}

export default BuscadorRespuestas
