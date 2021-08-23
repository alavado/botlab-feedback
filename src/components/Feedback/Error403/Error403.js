import React from 'react'
import Icon from '@iconify/react'
import icono from '@iconify/icons-mdi/chat-remove-outline'
import './Error403.css'
import { useDispatch } from 'react-redux'
import { cierraLaSesion } from '../../../redux/ducks/login'
import { limpiaEncuestas } from '../../../redux/ducks/encuestas'

const Error403 = ({ mensaje }) => {

  const dispatch = useDispatch()

  return (
    <div className="Error403">
      <Icon icon={icono} className="Error403__icono" />
      <p className="Error403__mensaje">{mensaje}</p>
      <button
        className="Error403__boton_cerrar_sesion"
        onClick={() => {
          dispatch(cierraLaSesion())
          dispatch(limpiaEncuestas())
        }}
      >
        Iniciar sesión con una cuenta diferente
      </button>
    </div>
  )
}

export default Error403
