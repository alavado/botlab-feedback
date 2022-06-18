import { useState } from 'react'
import { InlineIcon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { remueveFiltro, combinaFiltros } from '../../../../../redux/ducks/respuestas'
import ModalAyuda from '../../../../ModalAyuda'
import classNames from 'classnames'
import './Filtros.css'

const Filtros = () => {
  
  const { filtros } = useSelector(state => state.respuestas)
  const [indiceFiltroInicioDrag, setIndiceFiltroInicioDrag] = useState()
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const dispatch = useDispatch()
  const filtrosVisibles = filtros.filter(f => !f.oculto)

  return (
    <div className="Filtros">
      <div className="Filtros__titulo">
        <p className="Filtros__mensaje"><InlineIcon icon="mdi:filter" /> {filtrosVisibles.length > 0 ? 'Filtros activos:' : 'No hay filtros activos'}</p> 
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
            'Filtros__tag_filtro--multiple': f.nombresHeaders?.length > 1,
            'Filtros__tag_filtro--oculto': f.oculto,
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
            <InlineIcon icon="mdi:close" />
          </button>
        </div>
      ))}
      <button className="Filtros__boton_ayuda">
        <InlineIcon icon="mdi:help-circle" onClick={() => setMostrarAyuda(!mostrarAyuda)} />
      </button>
      {mostrarAyuda && <ModalAyuda cerrar={() => setMostrarAyuda(false)} />}
    </div>
  )
}

export default Filtros
