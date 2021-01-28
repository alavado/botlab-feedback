import React from 'react'
import video from '../../assets/images/demo_filtros.gif'
import Icon from '@iconify/react'
import iconoCerrar from '@iconify/icons-mdi/close'
import './ModalAyuda.css'

const ModalAyuda = ({ cerrar }) => {
  return (
    <div className="ModalAyuda">
      <button className="ModalAyuda__boton_cerrar" title="Cerrar ayuda" onClick={cerrar}>
        <Icon icon={iconoCerrar} />
      </button>
      <img className="ModalAyuda__gif" src={video} alt="Explicación filtros" />
      <div className="ModalAyuda__bajada">
        <h2 className="ModalAyuda__titulo">Cómo usar los filtros</h2>
        <ul className="ModalAyuda__explicación">
          <li>Filtra por columna haciendo click en su encabezado.</li>
          <li>Puedes combinar dos filtros arrastrando uno sobre el otro.</li>
        </ul>
      </div>
    </div>
  )
}

export default ModalAyuda
