import React, { useState } from 'react'
import { InlineIcon } from '@iconify/react'
import iconoRemoverFiltro from '@iconify/icons-mdi/close'
import iconoFiltros from '@iconify/icons-mdi/filter'
import { useDispatch, useSelector } from 'react-redux'
import { remueveFiltro, combinaFiltros } from '../../../../../redux/ducks/respuestas'
import './Filtros.css'

const Filtros = () => {
  
  const { filtros } = useSelector(state => state.respuestas)
  const [indiceFiltroInicioDrag, setIndiceFiltroInicioDrag] = useState()
  const dispatch = useDispatch()

  return (
    <div className="Filtros">
      <div className="Filtros__titulo">
        <InlineIcon icon={iconoFiltros} /> {filtros.length > 0 ? 'Filtros activos:' : 'No hay filtros activos'}
      </div>
      {filtros.map((f, i) => (
        <div
          className="Filtros__tag_filtro"
          key={`tag-filtro-${i}`}
          draggable={true}
          onDragStart={() => setIndiceFiltroInicioDrag(i)}
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => e.preventDefault()}
          onDrop={() => dispatch(combinaFiltros([indiceFiltroInicioDrag, i]))}
          title="Arrastra un filtro sobre otro para combinarlos"
        >
          {f.descripcion}
          <button
            className="Filtros__boton_remover_filtro"
            title="Remover este filtro"
            onClick={() => dispatch(remueveFiltro(i))}
          >
            <InlineIcon icon={iconoRemoverFiltro} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Filtros
