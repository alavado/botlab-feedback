import React, { useState } from 'react'
import { InlineIcon } from '@iconify/react'
import iconoRemoverFiltro from '@iconify/icons-mdi/close'
import iconoFiltros from '@iconify/icons-mdi/filter'
import iconoAyuda from '@iconify/icons-mdi/help-circle'
import { useDispatch, useSelector } from 'react-redux'
import { remueveFiltro, combinaFiltros } from '../../../../../redux/ducks/respuestas'
import './Filtros.css'
import ModalAyuda from '../../../../ModalAyuda'

const Filtros = () => {
  
  const { filtros } = useSelector(state => state.respuestas)
  const [indiceFiltroInicioDrag, setIndiceFiltroInicioDrag] = useState()
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const dispatch = useDispatch()

  return (
    <div className="Filtros">
      <div className="Filtros__titulo">
        <p className="Filtros__mensaje"><InlineIcon icon={iconoFiltros} /> {filtros.length > 0 ? 'Filtros activos:' : 'No hay filtros activos'}</p> 
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
      <button className="Filtros__boton_ayuda">
        <InlineIcon icon={iconoAyuda} onClick={() => setMostrarAyuda(!mostrarAyuda)} />
      </button>
      {mostrarAyuda && <ModalAyuda cerrar={() => setMostrarAyuda(false)} />}
    </div>
  )
}

export default Filtros
