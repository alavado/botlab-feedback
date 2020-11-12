import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { limpiaBusqueda } from '../../../../redux/ducks/busqueda'
import ResultadoBusqueda from './ResultadoBusqueda'
import Icon from '@iconify/react'
import iconoBuscar from '@iconify/icons-mdi/search'
import './ResultadosBusqueda.css'
import LoaderResultadosBusqueda from './LoaderResultadosBusqueda'

const ResultadosBusqueda = () => {

  const { resultadosBusqueda, buscando, termino } = useSelector(state => state.busqueda)
  const dispatch = useDispatch()

  if (buscando) {
    return <LoaderResultadosBusqueda />
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
      <div className="ResultadosBusqueda__superior">
        <div className="ResultadosBusqueda__encontrados">
          Buscaste: <span className="ResuladosBusqueda__termino">"{termino}"</span> - {resultadosBusqueda.length} chats encontrados
        </div>
        <button
          className="ResultadosBusqueda__boton_nueva_busqueda"
          onClick={() => dispatch(limpiaBusqueda())}
        >
          <Icon className="ResultadosBusqueda__icono_boton" icon={iconoBuscar} />
          Nueva búsqueda
        </button>
      </div>
      </div>
  )
}

export default ResultadosBusqueda
