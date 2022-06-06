import Icon from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { escondeModal } from '../../../redux/ducks/configuracion'
import iconoCerrar from '@iconify/icons-mdi/close'
import './ModalConfiguracion.css'

const ModalConfiguracion = () => {

  const { modalVisible } = useSelector(state => state.configuracion)
  const dispatch = useDispatch()

  return (
    <div
      className={classNames({
        "ModalConfiguracion": true,
        "ModalConfiguracion--visible": modalVisible
      })}
      onClick={() => dispatch(escondeModal())}
    >
      <div
        className="ModalConfiguracion__contenido"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="ModalConfiguracion__boton_cerrar"
          onClick={() => dispatch(escondeModal())}
        >
          <Icon icon={iconoCerrar} />
        </button>
        Confirmación: configuración
        <form className="ModalConfiguracion__formulario">
          <label>
            Tipo de cambio
            <select>
              <option>teléfono general de contacto</option>
              <option>horario de carga de una poll</option>
              <option>fechas de carga de una poll (qué dia se confirma qué otro día)</option>
              <option>nueva carga de poll</option>
              <option>texto a responder ante pregunta de precios/medios de pago</option>
            </select>
          </label>
          <label>
            Detalle
            <input />
          </label>
          <label>
            Contacto
            <input />
          </label>
          <button>Enviar</button>
        </form>
      </div>
    </div>
  )
}

export default ModalConfiguracion