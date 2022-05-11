import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaModal } from '../../redux/ducks/novedades'
import './Novedades.css'

const Novedades = () => {

  const { modalActivo } = useSelector(state => state.novedades)
  const dispatch = useDispatch()

  if (!modalActivo) {
    return null
  }

  return createPortal(
    <div
      className="Novedades__fondo"
      onClick={() => dispatch(desactivaModal())}
    >
      <div className="Novedades">
        Novedades del servicio
        <button
          onClick={() => dispatch(desactivaModal())}
        >
          cerrar
        </button>
      </div>
    </div>
  , document.getElementById('modal-novedades'))
}

export default Novedades