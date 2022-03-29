import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { alertas as alertasAPI } from '../../../api/endpoints'
import search from '@iconify/icons-mdi/search'
import alertas from '@iconify/icons-mdi/bell'
import exportar from '@iconify/icons-mdi/table-export'
import usage from '@iconify/icons-mdi/wallet'
import home from '@iconify/icons-mdi/home'
// import preparaciones from '@iconify/icons-mdi/clipboard-check'
import logo from '../../../assets/images/logo-cero.svg'
import './BarraLateral.css'
import { useQuery } from 'react-query'
import logoFeedback from '../../../assets/images/logo_cuadrado_notificaciones.png'
import { useSelector } from 'react-redux'
import { alertasVisibles } from '../../../redux/ducks/alertas'

const BarraLateral = () => {

  const [conteoAlertas, setConteoAlertas] = useState(0)
  const { recibirNotificaciones } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery(
    'alertas',
    alertasAPI,
    {
      refetchInterval: 30_000,
      refetchIntervalInBackground: 30_000,
      refetchOnMount: true,
      select: res => res.data,
    }
  )

  useEffect(() => {
    if (recibirNotificaciones) {
      Notification.requestPermission()
    }
  }, [recibirNotificaciones])

  useEffect(() => {
    if (!dataAlertas) {
      return
    }
    setConteoAlertas(prev => {
      const alertas = dataAlertas?.filter(a => alertasVisibles.indexOf(a.message) >= 0 && !a.dismissed) || []
      const nuevoConteo = alertas.length
      if (prev < nuevoConteo) {
        if (!document.hasFocus() && recibirNotificaciones) {
          let notificacion = new Notification(
            '',
            {
              icon: logoFeedback,
              body: `Feedback: ${alertas[0].message}`,
              silent: true,
              requireInteraction: true,
            }
          )
          notificacion.onclick = () => window.focus()
        }
      }
      return nuevoConteo
    })
  }, [dataAlertas, recibirNotificaciones])
  
  return (
    <div className="BarraLateral">
      <Link
        to="/"
        className="BarraLateral__link_logo"
      >
        <div className="BarraLateral__logo">
          <img className="BarraLateral__logo_imagen" src={logo} alt="Logo Cero.ai" />
          {window.location.href.includes('qa') && <p>QA</p>}
          {window.location.href.includes('dev') && <p>DEV</p>}
        </div>
      </Link>
      <div className="BarraLateral__contenedor_links_secciones">
        <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/"
          exact
        >
          <Icon icon={home} />
          <div className="BarraLateral__nombre_seccion">Respuestas</div>
        </NavLink>
        {(process.env.NODE_ENV === 'development' || window.location.href.includes('dev')) &&
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/alertas"
          >
            {conteoAlertas > 0 && <div className="BarraLateral__conteo_alertas">{conteoAlertas}</div>}
            <Icon icon={alertas} />
            <div className="BarraLateral__nombre_seccion">Alertas</div>
          </NavLink>
        }
        {/* <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/preparaciones"
        >
        <Icon icon={preparaciones} />
        <div className="BarraLateral__nombre_seccion">Preparaciones</div>
        </NavLink> */}
        <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/exportar"
        >
          <Icon icon={exportar} />
          <div className="BarraLateral__nombre_seccion">Reporte</div>
        </NavLink>
        <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/busqueda"
        >
          <Icon icon={search} />
          <div className="BarraLateral__nombre_seccion">Búsqueda</div>
        </NavLink>
        <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/uso"
        >
          <Icon icon={usage} />
          <div className="BarraLateral__nombre_seccion">Uso</div>
        </NavLink>
      </div>
    </div>
  )
}

export default BarraLateral
