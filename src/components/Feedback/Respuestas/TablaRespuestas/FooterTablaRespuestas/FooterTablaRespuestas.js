import Skeleton from '../../../../Skeleton'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { avanzaPagina, retrocedePagina } from '../../../../../redux/ducks/respuestas'
import './FooterTablaRespuestas.css'
import useAnalytics from '../../../../../hooks/useAnalytics'

const FooterTablaRespuestas = ({ cargando, respuestasPorPagina, totalRespuestas }) => {

  const numeroPaginas = Math.ceil(totalRespuestas / respuestasPorPagina)
  const { pagina } = useSelector(state => state.respuestas)
  const track = useAnalytics()

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
                    className="FooterTablaRespuestas__boton_pagina FooterTablaRespuestas__boton_pagina--anterior"
                    onClick={() => {
                      track('Feedback', 'Respuestas', 'retrocederPagina', { pagina })
                      dispatch(retrocedePagina())
                    }}
                    disabled={pagina === 1}
                    title="Página anterior"
                  >
                    <Icon className="FooterTablaRespuestas__boton_pagina_icono" icon="mdi:play" />
                    Anterior
                  </button>
                  <button
                    className="FooterTablaRespuestas__boton_pagina FooterTablaRespuestas__boton_pagina--siguiente"
                    onClick={() => {
                      track('Feedback', 'Respuestas', 'avanzarPagina', { pagina })
                      dispatch(avanzaPagina())
                    }}
                    disabled={numeroPaginas === 1 || pagina >= numeroPaginas}
                    title="Página siguiente"
                  >
                    Siguiente
                    <Icon className="FooterTablaRespuestas__boton_pagina_icono" icon="mdi:play" />
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
