import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cierraLaSesion } from '../../../../redux/ducks/login'
import './MenuUsuario.css'

const MenuUsuario = () => {

  const { nombreUsuario } = useSelector(state => state.login)
  const dispatch = useDispatch()

  return (
    <div className="MenuUsuario">
      { nombreUsuario }
      <button onClick={() => dispatch(cierraLaSesion())}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default MenuUsuario
