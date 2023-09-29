import video from '../../assets/images/demo_filtros.gif'
import videoDark from '../../assets/images/demo_filtros_dark.gif'
import { Icon } from '@iconify/react'
import './ModalAyuda.css'
import { useSelector } from 'react-redux'
import { ESQUEMA_OSCURO } from '../../redux/ducks/opciones'

const ModalAyuda = ({ cerrar }) => {

  const { esquema } = useSelector(state => state.opciones)

  return (
    <div className="ModalAyuda">
      <button className="ModalAyuda__boton_cerrar" title="Cerrar ayuda" onClick={cerrar}>
        <Icon icon="mdi:close" />
      </button>
      <img
        className="ModalAyuda__gif"
        src={esquema === ESQUEMA_OSCURO ? videoDark : video}
        alt="Explicación uso de filtros"
      />
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
