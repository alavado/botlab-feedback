import React, { useMemo, useState } from 'react'
import './Alertas.css'
import { alertas as getAlertas } from '../../../api/endpoints'
import { useQuery } from 'react-query'
import classNames from 'classnames'
import Icon, { InlineIcon } from '@iconify/react'
import iconoAlertasNoResueltas from '@iconify/icons-mdi/bell-ring-outline'
import iconoAlertasResueltas from '@iconify/icons-mdi/bell-check-outline'
import iconoMarcar from '@iconify/icons-mdi/check-bold'
import iconoSinAlertasPorResolver from '@iconify/icons-mdi/check'
import { addHours, format, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useDispatch, useSelector } from 'react-redux'
import { activaCajon, activaNotificaciones, agregaAlertasVisibles, alertasVisibles, remueveAlertasVisibles } from '../../../redux/ducks/alertas'
import Loader from '../../Loader'
import ListaAlertas from './ListaAlertas'
import CajonChat from './CajonChat'
import { obtenerEtiquetaAlerta, obtenerIconoAlerta } from '../../../helpers/alertas'

const tabsAlertas = [
  {
    id: 1,
    titulo: 'Por resolver',
    icono: iconoAlertasNoResueltas,
    filtro: a => alertasVisibles.indexOf(a.message) >= 0 && !a.dismissed,
    color: 'var(--color-alerta-pendiente)'
  },
  {
    id: 2,
    titulo: 'Resueltas',
    icono: iconoAlertasResueltas,
    filtro: a => alertasVisibles.indexOf(a.message) >= 0 && a.dismissed,
    color: 'var(--color-alerta-resuelta)'
  }
]

const Alertas = () => {

  const [idTabAlertasActivo, setIdTabAlertasActivo] = useState(tabsAlertas[0].id)
  const { recibirNotificaciones, verAlertas } = useSelector(state => state.alertas)
  const dispatch = useDispatch()
  const { isLoading: cargandoAlertas, data: dataAlertas } = useQuery(
    'alertas',
    getAlertas,
    {
      refetchInterval: 30_000,
      refetchOnMount: true,
      select: res => {
        return tabsAlertas.map(t => {
          const alertas = res.data
            .filter(t.filtro)
            .map(a => ({
              ...a,
              icono: obtenerIconoAlerta(a.message),
              horaLegible: !isToday(parseISO(a.utc_timestamp))
                ? format(parseISO(a.utc_timestamp), 'd MMM', { locale: es })
                : format(addHours(parseISO(a.utc_timestamp), new Date().getTimezoneOffset() / -60), 'HH:mm', { locale: es }),
            }))
          alertas.sort((a1, a2) => a1.utc_timestamp > a2.utc_timestamp ? -1 : 1)
          return {
            ...t,
            alertas,
            conteo: alertas.length,
          }
        })
      }
    }
  )

  const tiposAlertasConConteos = useMemo(() => {
    if (!dataAlertas) {
      return []
    }
    return alertasVisibles.map(nombre => ({
      nombre,
      conteo: dataAlertas
        .find(t => t.titulo === 'Por resolver')
        .alertas
        .filter(a => a.message === nombre && !a.meta.n_appointments)
        .length
    }))
  }, [dataAlertas])

  return (
    <div className="Alertas">
      {cargandoAlertas
        ? <div className="Alertas__loader">
            <Loader color="#6057f6" />
          </div>
        : <div className="Alertas__contenedor">
            <div className="Alertas__lateral">
              <h1 className="Alertas__titulo">Alertas</h1>
              <h2 className="Alertas__subtitulo">Ver alertas</h2>
              {tiposAlertasConConteos.map(({ nombre, conteo }, i) => (
                <label
                  key={`checkbox-${nombre}`}
                  className="Alertas__contenedor_opcion"
                  title={`${verAlertas?.indexOf(nombre) >= 0 ? 'Ocultar' : 'Ver'} alertas con el mensaje "${nombre}"`}
                >
                  <Icon
                    className="Alertas__icono_checkbox"
                    icon={iconoMarcar}
                  />
                  <input
                    type="checkbox"
                    className={classNames({
                      "Alertas__checkbox_opcion": true,
                      "Alertas__checkbox_opcion--activo": verAlertas?.indexOf(nombre) >= 0
                    })}
                    checked={verAlertas?.indexOf(nombre) >= 0}
                    onChange={e => {
                      if (e.target.checked) {
                        dispatch(agregaAlertasVisibles(nombre))
                      }
                      else {
                        dispatch(remueveAlertasVisibles(nombre))
                      }
                    }}
                  />
                  <Icon
                    icon={obtenerIconoAlerta(nombre)}
                    className="Alertas__icono_tipo_alerta"
                  />
                  <span className="Alertas__etiqueta_tipo_alerta">
                    {obtenerEtiquetaAlerta(nombre)}
                  </span>
                  <span className="Alertas__conteo_tipo_alerta">
                    {conteo === 0
                      ? <><InlineIcon icon={iconoSinAlertasPorResolver} /> Sin alertas por resolver</>
                      : <><InlineIcon icon={iconoAlertasNoResueltas} /> {conteo} alerta{conteo !== 1 ? 's' : ''} por resolver</>
                    }
                  </span>
                </label>
              ))}
              <h2 className="Alertas__subtitulo">Opciones</h2>
              <label
                className="Alertas__contenedor_opcion"
                title="Activar o desactivar alertas de escritorio ante nuevas alertas"
              >
                <div
                  className={classNames({
                    "Alertas__switch": true,
                    "Alertas__switch--activo": recibirNotificaciones
                  })}
                />
                <input
                  type="checkbox"
                  className="Alertas__checkbox_oculto"
                  checked={recibirNotificaciones}
                  onChange={e => dispatch(activaNotificaciones(e.target.checked))}
                /> {recibirNotificaciones ? 'Notificaciones activas': 'Notificaciones desactivadas'}
              </label>
            </div>
            <div className="Alertas__contenedor_secciones_alertas">
              <div className="Alertas__contenedor_tabs">
                {dataAlertas.map(tipoAlertas => (
                  <button
                    key={`boton-tipo-alertas-${tipoAlertas.id}`}
                    className={classNames({
                      "Alertas__boton_tab": true,
                      "Alertas__boton_tab--activo": idTabAlertasActivo === tipoAlertas.id,
                    })}
                    onClick={() => setIdTabAlertasActivo(tipoAlertas.id)}
                    style={{ '--color-tab-alerta': tipoAlertas.color }}
                  >
                    <InlineIcon className="Alertas__icono_tab" icon={tipoAlertas.icono} />
                    <p className="Alertas__boton_tab_titulo">{tipoAlertas.titulo}</p>
                    <p className="Alertas__boton_tab_subtitulo">{tipoAlertas.conteo} alerta{tipoAlertas.conteo !== 1 && 's'}</p>
                  </button>
                ))}
              </div>
              <ListaAlertas
                alertas={dataAlertas}
                idAlertasVisibles={idTabAlertasActivo}
                mostrarCajon={() => dispatch(activaCajon(true))}
              />
            </div>
            <CajonChat />
          </div>
      }
    </div>
  )
}

export default Alertas
