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
        </button>
      </div>
    </OutsideClickHandler>
  )
}

export default Rangos