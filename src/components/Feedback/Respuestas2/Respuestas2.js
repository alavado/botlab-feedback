import ListaInteracciones from './ListaInteracciones'
import './Respuestas2.css'
import TabsEstadosInteracciones from './TabsEstadosInteracciones'
import TabsServicios from './TabsServicios'
import IndicadorFetchingGlobal from './IndicadorFetchingGlobal'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { InlineIcon } from '@iconify/react'
import iconoSucursal from '@iconify/icons-mdi/place'
import iconoCalendario from '@iconify/icons-mdi/calendar-check'
import iconoSeleccionarSucursal from '@iconify/icons-mdi/triangle-small-down'
import logoCero from '../../../assets/images/logo_blanco.png'

const Respuestas2 = () => {

  const { cajonFiltrosVisible } = useSelector(state => state.servicio)

  return (
    <div className="Respuestas2">
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
        <div>
          <button>Usuario</button>
        </div>
        <div className="Respuestas2__selector_sucursal">
          <div className="Respuestas2__boton_selector">
            <InlineIcon icon={iconoCalendario} />
            hoy, viernes 3 de junio
            <InlineIcon icon={iconoSeleccionarSucursal} />
          </div>
          <div className="Respuestas2__boton_selector">
            <InlineIcon icon={iconoSucursal} />
            Todas las sucursales
            <InlineIcon icon={iconoSeleccionarSucursal} />
          </div>
        </div>
      </div>
      <aside
        className={classNames({
          "Respuestas2__lateral": true,
          "Respuestas2__lateral--visible": cajonFiltrosVisible,
        })}
      >
        <h2>Sucursal</h2>
        <li>
          
        </li>
      </aside>
      <TabsServicios />
      <TabsEstadosInteracciones />
      <ListaInteracciones />
    </div>
  )
}

export default Respuestas2