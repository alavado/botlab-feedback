import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import './Novedades.css'

const Novedades = () => {

  const { modalVisible } = useSelector(state => state.novedades)

  if (!modalVisible) {
    return null
  }

  return createPortal(
    <div className="Novedades">
      Novedades
    </div>
  , document.getElementById('modal-novedades'))
}

export default Novedades