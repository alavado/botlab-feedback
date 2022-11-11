import { Icon } from '@iconify/react'
import OutsideClickHandler from 'react-outside-click-handler'
import { Link } from 'react-router-dom'
import './Rangos.css'

const Rangos = ({ rangos, ocultar }) => {
  return (
    <OutsideClickHandler onOutsideClick={ocultar}>
      <div className="Rangos">
        {rangos.map((rango, i) => (
          <button
            key={`rango-${i}`}
            onClick={rango.onClick}
          >
            {rango.etiqueta}
          </button>
        ))}
        <p className="Rangos__mensaje">Para consultar otros rangos, por favor usa la sección <Link to="/exportar">Reporte <Icon icon="mdi:table-arrow-right" /></Link></p>
      </div>
    </OutsideClickHandler>
  )
}

export default Rangos