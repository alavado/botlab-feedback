import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaEnviador } from '../../../../redux/ducks/enviador'
import './EnviadorRepuestas.css'

const EnviadorRepuestas = () => {

  const { activo } = useSelector(state => state.enviador)
  const dispatch = useDispatch()

  if (!activo) {
    return null
  }

  return createPortal(
    <div
      className="EnviadorRepuestas"
      onClick={() => dispatch(desactivaEnviador())}
    >
      <div className="EnviadorRespuestas__contenedor">
        x
      </div>
    </div>
  , document.getElementById('modal-enviador-respuestas'))
}

export default EnviadorRepuestas