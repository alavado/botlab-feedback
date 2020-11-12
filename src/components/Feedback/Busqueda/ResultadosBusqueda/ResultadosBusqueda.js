import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { limpiaBusqueda } from '../../../../redux/ducks/busqueda'
import ResultadoBusqueda from './ResultadoBusqueda'
import Icon from '@iconify/react'
import iconoBuscar from '@iconify/icons-mdi/search'
import './ResultadosBusqueda.css'

const ResultadosBusqueda = () => {

  const { resultadosBusqueda, buscando } = useSelector(state => state.busqueda)
  const dispatch = useDispatch()

  if (buscando) {
    return 'buscando...'
  }

  return (
    <div className="ResultadosBusqueda">
      <div className="ResultadosBusqueda__contenedor_resultados">
        {resultadosBusqueda.map((r, i) => (
          <ResultadoBusqueda
            key={`resultado-busqueda-${i}`}
            resultado={r}
          />
        ))}
      </div>
      <button
        className="ResultadosBusqueda__boton_nueva_busqueda"
        onClick={() => dispatch(limpiaBusqueda())}
      >
        <Icon className="ResultadosBusqueda__icono_boton" icon={iconoBuscar} />
        Nueva búsqueda
      </button>
    </div>
  )
}

export default ResultadosBusqueda
