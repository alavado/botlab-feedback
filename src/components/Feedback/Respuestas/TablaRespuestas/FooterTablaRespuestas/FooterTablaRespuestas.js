import React from 'react'
import './FooterTablaRespuestas.css'

const FooterTablaRespuestas = ({ respuestasPorPagina, totalRespuestas, pagina, setPagina }) => {

  const numeroPaginas = 1 + Math.ceil(totalRespuestas / respuestasPorPagina)

  return (
    <div className="FooterTablaRespuestas">
      <p className="FooterTablaRespuestas__total">
        {/* <span className="FooterTablaRespuestas__numero_total">{respuestas.length.toLocaleString('de-DE')}</span> resultados - mostrando {50 * (pagina - 1) + 1} a {Math.min(50 * pagina, respuestas.length)} */}
        <span className="FooterTablaRespuestas__numero_total">{totalRespuestas.toLocaleString('de-DE')}</span> resultados
      </p>
      {totalRespuestas > respuestasPorPagina &&
        <div className="FooterTablaRespuestas__botones_paginas">
          <button
            className="FooterTablaRespuestas__boton_pagina"
            onClick={() => setPagina(pagina - 1)}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <button
            className="FooterTablaRespuestas__boton_pagina"
            onClick={() => setPagina(pagina + 1)}
            disabled={numeroPaginas === 1 || pagina >= numeroPaginas}
          >
            Siguiente
          </button>
        </div>
      }
    </div>
  )
}

export default FooterTablaRespuestas
