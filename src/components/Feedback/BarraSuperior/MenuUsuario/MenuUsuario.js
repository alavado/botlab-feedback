import React, { useState } from 'react'
import PopupMenuUsuario from './PopupMenuUsuario'
import { InlineIcon } from '@iconify/react'
import iconoUsuario from '@iconify/icons-mdi/account-circle'
import iconoScrambled from '@iconify/icons-mdi/incognito'
import './MenuUsuario.css'
import { useSelector } from 'react-redux'
import Scrambler from '../../../Scrambler/Scrambler'
import classNames from 'classnames'

const MenuUsuario = () => {

  const [mostrarMenu, setMostrarMenu] = useState(false)
  const { scrambled } = useSelector(state => state.scrambler)
  const { nombreUsuario } = useSelector(state => state.login)

  return (
    <>
      <div className={classNames({
        'MenuUsuario': true,
        'MenuUsuario--incognito': scrambled
      })}>
        <button
          className="MenuUsuario__boton_mostrar_popup"
          onClick={() => setMostrarMenu(true)}
        >
          <InlineIcon icon={scrambled ? iconoScrambled : iconoUsuario} />
          {nombreUsuario && <span className="MenuUsuario__nombre_usuario">
            <Scrambler tipo="usuario" propagar={true}>{nombreUsuario}</Scrambler>
          </span>}
        </button>
      </div>
      <PopupMenuUsuario
        visible={mostrarMenu}
        esconder={() => setMostrarMenu(false)}
      />
    </>
  )
}

export default MenuUsuario
