import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { activaNotificaciones } from '../../../../redux/ducks/alertas'
import './OpcionesAlertas.css'

const OpcionesAlertas = () => {

  const { recibirNotificaciones } = useSelector(state => state.alertas)
  const dispatch = useDispatch()

  return (
    <div className="OpcionesAlertas">
      <h2 className="OpcionesAlertas__titulo">Opciones</h2>
      <label
        className="OpcionesAlertas__contenedor_opcion"
        title="Activar o desactivar alertas de escritorio ante nuevas alertas"
      >
        <div
          className={classNames({
            "OpcionesAlertas__switch": true,
            "OpcionesAlertas__switch--activo": recibirNotificaciones
          })}
        />
        <input
          type="checkbox"
          className="OpcionesAlertas__checkbox_oculto"
          checked={recibirNotificaciones}
          onChange={e => dispatch(activaNotificaciones(e.target.checked))}
        /> {recibirNotificaciones ? 'Notificaciones activas': 'Notificaciones desactivadas'}
      </label>
    </div>
  )
}

export default OpcionesAlertas