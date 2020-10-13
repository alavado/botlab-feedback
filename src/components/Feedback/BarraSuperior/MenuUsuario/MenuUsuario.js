import React, { useState } from 'react'
import PopupMenuUsuario from './PopupMenuUsuario'
import { InlineIcon } from '@iconify/react'
import iconoUsuario from '@iconify/icons-mdi/user'
import './MenuUsuario.css'

const MenuUsuario = () => {

  const [mostrarMenu, setMostrarMenu] = useState(false)

  return (
    <div className="MenuUsuario">
      <button
        className="MenuUsuario__boton_mostrar_popup"
        onClick={() => setMostrarMenu(true)}
      >
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
