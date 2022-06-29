import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { cierraLaSesion } from '../../../../redux/ducks/login'
import './ModalMenuUsuario.css'

const ModalMenuUsuario = ({ activo, cerrar } : { activo: boolean, cerrar: Function }) => {

  const dispatch = useDispatch()

  const acciones = useMemo(() => ([
    {
      etiqueta: 'Uso',
      onClick: () => dispatch(cierraLaSesion()),
      icono: 'mdi:wallet'
    },
    {
      etiqueta: 'Cerrar Sesión',
      onClick: () => dispatch(cierraLaSesion()),
      icono: 'mdi:logout'
    },
  ]), [dispatch])

  return (
    <div
      className={classNames({
        'ModalMenuUsuario': true,
        'ModalMenuUsuario--activo': activo,
      })}
      onClick={() => cerrar()}
    >
      <div className="ModalMenuUsuario__contenedor_botones">
        {acciones.map(accion => (
          <button
            className="ModalMenuUsuario__boton_accion"
            onClick={e => {
              e.stopPropagation()
              accion.onClick()
            }}
          >
            <InlineIcon icon={accion.icono} />
            {accion.etiqueta}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ModalMenuUsuario