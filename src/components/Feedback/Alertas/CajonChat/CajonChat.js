import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { activaCajon } from '../../../../redux/ducks/alertas'
import './CajonChat.css'
import DatosPaciente from './DatosPaciente'

const CajonChat = () => {

  const { cajonActivo } = useSelector(state => state.alertas)
  const dispatch = useDispatch()

  return (
    <div className={classNames({
      'CajonChat': true,
      'CajonChat--activo': cajonActivo
    })}>
      <div className="CajonChat__superior">
        <DatosPaciente />
        <button onClick={() => dispatch(activaCajon(false))}>Cerrar</button>
      </div>
      <div className="CajonChat__mensajes">
      </div>
    </div>
  )
}

export default CajonChat