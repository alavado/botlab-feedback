import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { limpiaBusqueda } from '../../../../redux/ducks/busqueda'
import ResultadoBusqueda from './ResultadoBusqueda'
import './ResultadosBusqueda.css'

const ResultadosBusqueda = () => {

  const { resultadosBusqueda } = useSelector(state => state.busqueda)
  const dispatch = useDispatch()

  console.log(resultadosBusqueda)

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
        Nueva búsqueda
      </button>
    </div>
  )
}

export default ResultadosBusqueda
