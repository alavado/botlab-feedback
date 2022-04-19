import classNames from 'classnames'
import './CajonChat.css'

const CajonChat = ({ activo, esconder }) => {
  return (
    <div className={classNames({
      'CajonChat': true,
      'CajonChat--activo': activo
    })}>
      CajonChat
      <button onClick={esconder}>Cerrar</button>
    </div>
  )
}

export default CajonChat