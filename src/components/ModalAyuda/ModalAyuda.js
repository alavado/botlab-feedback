import React from 'react'
import video from '../../assets/images/demo_filtros.gif'
import './ModalAyuda.css'

const ModalAyuda = () => {
  return (
    <div className="ModalAyuda">
      <img className="ModalAyuda__gif" src={video} alt="Explicación filtros" />
      <div className="ModalAyuda__bajada">
        <h2 className="ModalAyuda__titulo">Herramienta de filtros</h2>
        <ul className="ModalAyuda__explicación">
          <li>Filtra por columna haciendo click en su encabezado.</li>
          <li>Puedes combinar dos filtros arrastrando uno sobre el otro.</li>
        </ul>
      </div>
    </div>
  )
}

export default ModalAyuda
