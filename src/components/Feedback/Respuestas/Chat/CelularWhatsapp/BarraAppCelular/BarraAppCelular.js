import { Icon } from '@iconify/react'
import './BarraAppCelular.css'
import { useDispatch } from 'react-redux'
import { fijaChatExpandido } from '../../../../../../redux/ducks/opciones'
import Scrambler from '../../../../../Scrambler'

const BarraAppCelular = ({ nombrePaciente, telefono }) => {
  const dispatch = useDispatch()

  return (
    <div className="BarraAppCelular">
      <div className="BarraAppCelular__izquierda">
        <div
          className="BarraAppCelular__avatar"
          style={{
            '--avatar-hue':
              360 *
              (((nombrePaciente?.[0].toLowerCase() ?? 'z').charCodeAt(0) - 97) /
                25),
          }}
        >
          {nombrePaciente?.[0] || ''}
        </div>
        <div className="BarraAppCelular__contenedor_nombre">
          <div className="BarraAppCelular__nombre">
            <Scrambler tipo="usuario">{nombrePaciente}</Scrambler>
          </div>
          <div className="BarraAppCelular__estado">{telefono}</div>
        </div>
      </div>
      <div className="BarraAppCelular__contenedor_iconos">
        {/* <button
          onClick={() => dispatch(fijaChatExpandido(true))}
          className="BarraAppCelular__iconos"
          title="Vista expandida"
        >
          <Icon icon="mdi:arrow-expand" />
        </button> */}
        {/* <button
          onClick={() => mensajes && actualizarMensajes(false)}
          className={classNames({
            "BarraAppCelular__iconos": true,
            "BarraAppCelular__cargando": !mensajes
          })}
          title="Actualizar mensajes"
        >
          <Icon icon={iconoActualizar} />
        </button> */}
      </div>
    </div>
  )
}

export default BarraAppCelular
