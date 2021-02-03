import React, { useState } from 'react'
import { InlineIcon } from '@iconify/react'
import iconoRemoverFiltro from '@iconify/icons-mdi/close'
import iconoFiltros from '@iconify/icons-mdi/filter'
import iconoAyuda from '@iconify/icons-mdi/help-circle'
import { useDispatch, useSelector } from 'react-redux'
import { remueveFiltro, combinaFiltros } from '../../../../../redux/ducks/respuestas'
import ModalAyuda from '../../../../ModalAyuda'
import classNames from 'classnames'
import './Filtros.css'

const Filtros = () => {
  
  const { filtros } = useSelector(state => state.respuestas)
  console.log(filtros)
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
          key={`tag-filtro-${i}`}
          draggable={true}
          onDragStart={() => setIndiceFiltroInicioDrag(i)}
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => e.preventDefault()}
          onDrop={() => dispatch(combinaFiltros([indiceFiltroInicioDrag, i]))}
          title="Arrastra un filtro sobre otro para combinarlos"
          className={classNames({
            'Filtros__tag_filtro': true,
            'Filtros__tag_filtro--global': f.headers === '*',
            'Filtros__tag_filtro--multiple': f.nombresHeaders?.length > 1
          })}
        >
          {f.headers === '*' ? f.descripcion : f.busqueda.map((b, i) => (
            <span key={`tag-filtro-${i}`} className="Filtros__elemento_tag_filtro">
              <span style={{ fontWeight: '600' }}>"{b}"</span> <span>en</span> <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{f.nombresHeaders[i]}</span>
            </span>
          ))}
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
