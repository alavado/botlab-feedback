import React from 'react'
import './FooterTablaRespuestas.css'

const FooterTablaRespuestas = ({ respuestasPorPagina, totalRespuestas, pagina, setPagina }) => {

  const numeroPaginas = Math.ceil(totalRespuestas / respuestasPorPagina)

  const mensaje = totalRespuestas === 0
    ? <>No se encontraron respuestas</>
    : <>
        Mostrando {respuestasPorPagina * (pagina - 1) + 1} a {Math.min(respuestasPorPagina * pagina, totalRespuestas)} de <span className="FooterTablaRespuestas__numero_total">{totalRespuestas.toLocaleString('de-DE')}</span>
      </>
  
  return (
    <div className="FooterTablaRespuestas">
      <p className="FooterTablaRespuestas__total">
        {mensaje}
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
