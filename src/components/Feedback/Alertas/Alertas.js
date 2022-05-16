import React, { useState } from 'react'
import './Alertas.css'
import { alertas as getAlertas } from '../../../api/endpoints'
import { useQuery } from 'react-query'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import iconoAlertasNoResueltas from '@iconify/icons-mdi/bell-ring-outline'
import iconoAlertasResueltas from '@iconify/icons-mdi/bell-check-outline'
import { addHours, format, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useDispatch, useSelector } from 'react-redux'
import { activaCajon, mensajesAlertasVisibles } from '../../../redux/ducks/alertas'
import Loader from '../../Loader'
import ListaAlertas from './ListaAlertas'
import CajonChat from './CajonChat'
import { obtenerIconoAlerta, obtenerNombrePaciente } from '../../../helpers/alertas'
import CheckboxesTiposAlertas from './CheckboxesTiposAlertas'
import OpcionesAlertas from './OpcionesAlertas'

const tabsAlertas = [
  {
    id: 1,
    titulo: 'Por resolver',
    icono: iconoAlertasNoResueltas,
    filtro: a => mensajesAlertasVisibles.indexOf(a.message) >= 0 && !a.dismissed,
    color: 'var(--color-alerta-pendiente)'
  },
  {
    id: 2,
    titulo: 'Resueltas',
    icono: iconoAlertasResueltas,
    filtro: a => mensajesAlertasVisibles.indexOf(a.message) >= 0 && a.dismissed,
    color: 'var(--color-alerta-resuelta)'
  }
]

const Alertas = () => {

  const [idTabAlertasActivo, setIdTabAlertasActivo] = useState(tabsAlertas[0].id)
  const { verAlertas } = useSelector(state => state.alertas)
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
              nombrePaciente: obtenerNombrePaciente(a),
              icono: obtenerIconoAlerta(a.message),
              horaLegible: !isToday(parseISO(a.utc_timestamp))
                ? format(parseISO(a.utc_timestamp), 'd MMM', { locale: es })
                : format(addHours(parseISO(a.utc_timestamp), new Date().getTimezoneOffset() / -60), 'HH:mm', { locale: es }),
            }))
          alertas.sort((a1, a2) => a1.utc_timestamp > a2.utc_timestamp ? -1 : 1)
          return {
            ...t,
            alertas,
            conteo: alertas.filter(a => verAlertas.includes(a.message)).length,
          }
        })
      }
    }
  )

  return (
    <div className="Alertas">
      {cargandoAlertas
        ? <div className="Alertas__loader">
            <Loader color="#6057f6" />
          </div>
        : <div className="Alertas__contenedor">
            <div className="Alertas__lateral">
              <h1 className="Alertas__titulo">Alertas</h1>
              <CheckboxesTiposAlertas alertas={dataAlertas} />
              <OpcionesAlertas />
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
                    title={`Ver alertas ${tipoAlertas.titulo}`}
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
