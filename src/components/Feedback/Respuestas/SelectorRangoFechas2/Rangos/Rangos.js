import { InlineIcon } from '@iconify/react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useHistory } from 'react-router-dom'
import './Rangos.css'

const Rangos = ({ rangos, ocultar }) => {

  const history = useHistory()

  return (
    <OutsideClickHandler onOutsideClick={ocultar}>
      <div className="Rangos">
        {rangos.map((rango, i) => (
          <button
            className="Rangos__opcion"
            key={`rango-${i}`}
            onClick={rango.onClick}
          >
            {rango.etiqueta}
          </button>
        ))}
        <button
          className="Rangos__opcion"
          onClick={() => history.push('/exportar')}
        >
          Otro rango (Reporte)
          <InlineIcon icon="mdi:table-export" />
        </button>
        <button
          className="Rangos__opcion"
          onClick={() => history.push('/busqueda')}
        >
          Búsqueda general
          <InlineIcon icon="mdi:search" />
        </button>
      </div>
    </OutsideClickHandler>
  )
}

export default Rangos