import React, { useState } from 'react'
import PopupMenuUsuario from './PopupMenuUsuario'
import { InlineIcon } from '@iconify/react'
import iconoUsuario from '@iconify/icons-mdi/user'
import './MenuUsuario.css'
import { useSelector } from 'react-redux'

const MenuUsuario = () => {

  const [mostrarMenu, setMostrarMenu] = useState(false)
  const { nombreUsuario } = useSelector(state => state.login)

  return (
    <div className="MenuUsuario">
      <button
        className="MenuUsuario__boton_mostrar_popup"
        onClick={() => setMostrarMenu(true)}
      >
        <span className="MenuUsuario__nombre_usuario">{nombreUsuario}</span>
        <InlineIcon icon={iconoUsuario} />
      </button>
      <PopupMenuUsuario
        visible={mostrarMenu}
        esconder={() => setMostrarMenu(false)}
      />
    </div>
  )
}

export default MenuUsuario
