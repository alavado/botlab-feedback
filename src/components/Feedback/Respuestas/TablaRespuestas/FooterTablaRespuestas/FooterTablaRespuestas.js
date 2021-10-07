import React from 'react'
import Skeleton from '../../../../Skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { avanzaPagina, retrocedePagina } from '../../../../../redux/ducks/respuestas'
import './FooterTablaRespuestas.css'

const FooterTablaRespuestas = ({ cargando, respuestasPorPagina, totalRespuestas }) => {

  const numeroPaginas = Math.ceil(totalRespuestas / respuestasPorPagina)
  const { pagina } = useSelector(state => state.respuestas)

  const dispatch = useDispatch()

  const mensaje = totalRespuestas === 0
    ? <></>
    : <>
        Mostrando {(respuestasPorPagina * (pagina - 1) + 1).toLocaleString('de-DE')} a {Math.min(respuestasPorPagina * pagina, totalRespuestas).toLocaleString('de-DE')} de <span className="FooterTablaRespuestas__numero_total">{totalRespuestas.toLocaleString('de-DE')}</span>
      </>
  
  return (
    <div className="FooterTablaRespuestas">
      <div className="FooterTablaRespuestas__datos_paginacion">
        {cargando
          ? <Skeleton width={300} />
          : <>
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
            </>
          }
      </div>
    </div>
  )
}

export default FooterTablaRespuestas
