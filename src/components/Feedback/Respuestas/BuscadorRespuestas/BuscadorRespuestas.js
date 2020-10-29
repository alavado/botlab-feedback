import React from 'react'
import Icon from '@iconify/react'
import iconoBuscar from '@iconify/icons-mdi/search'
import iconoBorrarBusqueda from '@iconify/icons-mdi/close'
import './BuscadorRespuestas.css'
import { useDispatch, useSelector } from 'react-redux'
import { buscaEsto } from '../../../../redux/ducks/respuestas'
import classNames from 'classnames'

const BuscadorRespuestas = () => {

  const { busqueda } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  return (
    <div className="BuscadorRespuestas">
      <div
        className="BuscadorRespuestas__contenedor_icono"
        onClick={() => dispatch(buscaEsto(''))}
        style={{ pointerEvents: busqueda ? 'all' : 'none' }}
        title="Limpiar búsqueda"
      >
        <Icon
          icon={busqueda ? iconoBorrarBusqueda : iconoBuscar}
          className="BuscadorRespuestas__icono"
        />
      </div>
      <input
        className={classNames({
          BuscadorRespuestas__input: true,
          'BuscadorRespuestas__input--activo': busqueda,
        })}
        onChange={e => dispatch(buscaEsto(e.target.value))}
        value={busqueda}
      />
    </div>
  )
}

export default BuscadorRespuestas
