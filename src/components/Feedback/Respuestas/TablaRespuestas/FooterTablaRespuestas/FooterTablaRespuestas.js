import { InlineIcon } from '@iconify/react'
import iconoRemoverFiltro from '@iconify/icons-mdi/close'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { avanzaPagina, remueveFiltro, retrocedePagina } from '../../../../../redux/ducks/respuestas'
import './FooterTablaRespuestas.css'

const FooterTablaRespuestas = ({ respuestasPorPagina, totalRespuestas }) => {

  const numeroPaginas = Math.ceil(totalRespuestas / respuestasPorPagina)
  const { pagina } = useSelector(state => state.respuestas)
  const { filtros } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  const mensaje = totalRespuestas === 0
    ? <>No se encontraron respuestas</>
    : <>
        Mostrando {(respuestasPorPagina * (pagina - 1) + 1).toLocaleString('de-DE')} a {Math.min(respuestasPorPagina * pagina, totalRespuestas).toLocaleString('de-DE')} de <span className="FooterTablaRespuestas__numero_total">{totalRespuestas.toLocaleString('de-DE')}</span>
      </>
  
  return (
    <div className="FooterTablaRespuestas">
      <div className="FooterTablaRespuestas__filtros">
        <div className="FooterTablaRespuestas__titulo_filtros">
          {filtros.length > 0 ? 'Filtros activos:' : 'No hay filtros activos'}
        </div>
        {filtros.map((f, i) => (
          <div
            className="FooterTablaRespuestas__tag_filtro"
            key={`tag-filtro-${i}`}
          >
            {f.descripcion}
            <button
              className="FooterTablaRespuestas__boton_remover_filtro"
              title="Remover este filtro"
              onClick={() => dispatch(remueveFiltro(i))}
            >
              <InlineIcon icon={iconoRemoverFiltro} />
            </button>
          </div>
        ))}
      </div>
      <div className="FooterTablaRespuestas__datos_paginacion">
        <p className="FooterTablaRespuestas__total">
          {mensaje}
        </p>
        {totalRespuestas > respuestasPorPagina &&
          <div className="FooterTablaRespuestas__botones_paginas">
            <button
              className="FooterTablaRespuestas__boton_pagina"
              onClick={() => dispatch(retrocedePagina())}
              disabled={pagina === 1}
            >
              Anterior
            </button>
            <button
              className="FooterTablaRespuestas__boton_pagina"
              onClick={() => dispatch(avanzaPagina())}
              disabled={numeroPaginas === 1 || pagina >= numeroPaginas}
            >
              Siguiente
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default FooterTablaRespuestas
