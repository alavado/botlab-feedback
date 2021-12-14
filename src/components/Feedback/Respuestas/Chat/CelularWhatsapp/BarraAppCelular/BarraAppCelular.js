import React from 'react'
import { Icon } from '@iconify/react'
import iconoVolver from '@iconify/icons-mdi/arrow-back'
import iconoExpandir from '@iconify/icons-mdi/arrow-expand'
import iconoActualizar from '@iconify/icons-mdi/refresh'
import './BarraAppCelular.css'
import { useDispatch, useSelector } from 'react-redux'
import { fijaChatExpandido } from '../../../../../../redux/ducks/opciones'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames'
import Scrambler from '../../../../../Scrambler'

const BarraAppCelular = ({ mensajes, actualizarMensajes }) => {

  const { nombreUsuario } = useSelector(state => state.login)
  const dispatch = useDispatch()
  const history = useHistory()

  return (
    <div className="BarraAppCelular">
      <div className="BarraAppCelular__izquierda">
        <Icon
          icon={iconoVolver}
          className="BarraAppCelular__icono_volver"
          onClick={() => history.goBack()}
        />
        <div className="BarraAppCelular__avatar">{nombreUsuario[0]}</div>
        <div className="BarraAppCelular__contenedor_nombre">
          <div className="BarraAppCelular__nombre">
            <Scrambler tipo="usuario">{nombreUsuario.split(' ')[0]}</Scrambler>
          </div>
          <div className="BarraAppCelular__estado">
            en línea
          </div>
        </div>
      </div>
      <div className="BarraAppCelular__contenedor_iconos">
        <button
          onClick={() => dispatch(fijaChatExpandido(true))}
          className="BarraAppCelular__iconos"
          title="Vista expandida"
        >
          <Icon icon={iconoExpandir} />
        </button>
        <button
          onClick={() => mensajes && actualizarMensajes(false)}
          className={classNames({
            "BarraAppCelular__iconos": true,
            "BarraAppCelular__cargando": !mensajes
          })}
          title="Actualizar mensajes"
        >
          <Icon icon={iconoActualizar} />
        </button>
      </div>
    </div>
  )
}

export default BarraAppCelular
