import ListaInteracciones from './ListaInteracciones'
import './Respuestas2.css'
import TabsEstadosInteracciones from './TabsEstadosInteracciones'
import TabsServicios from './TabsServicios'
import IndicadorFetchingGlobal from './IndicadorFetchingGlobal'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { InlineIcon } from '@iconify/react'
import logoCero from '../../../assets/images/logo_blanco.png'
import { useAlertasQuery } from '../../../api/hooks'
import { useState } from 'react'
import ModalMenuUsuario from './ModalMenuUsuario'
import SelectorFechaInteraccion from './SelectorFechaInteraccion'
import SelectorSucursalInteraccion from './SelectorSucursalInteraccion'

const Respuestas2 = () => {

  const { cajonFiltrosVisible } = useSelector(state => state.servicio)
  const { nombreUsuario } = useSelector(state => state.login)
  const [menuUsuarioActivo, setMenuUsuarioActivo] = useState(false)
  useAlertasQuery()

  return (
    <div className="Respuestas2">
      <ModalMenuUsuario
        activo={menuUsuarioActivo}
        cerrar={() => setMenuUsuarioActivo(false)}
      />
      <div className="Respuestas2__superior">
        <div className="Respuestas2__contenedor_start">
          <img
            src={logoCero}
            alt="Logo CERO"
            className="Respuestas2__logo"
          />
          <h1 className="Respuestas2__titulo">Feedback</h1>
          <IndicadorFetchingGlobal />
        </div>
        <div className="Respuestas2__selectores">
          <SelectorFechaInteraccion />
          <SelectorSucursalInteraccion />
        </div>
        <div className="Respuestas2__usuario">
          <button
            className="Respuestas2__boton_usuario"
            onClick={() => setMenuUsuarioActivo(!menuUsuarioActivo)}
          >
            <InlineIcon icon="mdi:account-box" />
            {nombreUsuario}
            <InlineIcon icon="mdi:triangle-small-down" />
          </button>
        </div>
      </div>
      <aside
        className={classNames({
          "Respuestas2__lateral": true,
          "Respuestas2__lateral--visible": cajonFiltrosVisible,
        })}
      >
        <h2>Global</h2>
        <div style={{
          width: '10rem',
          height: '10rem',
          background: 'red',
          borderRadius: '50%'
        }}>
          Esto es relleno
        </div>
        <h2>Filtros??</h2>
        <h2>Config</h2>
      </aside>
      <TabsServicios />
      <TabsEstadosInteracciones />
      <ListaInteracciones />
    </div>
  )
}

export default Respuestas2