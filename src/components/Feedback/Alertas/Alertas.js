import React, { useEffect, useState } from 'react'
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
import { mensajesAlertasVisibles, seleccionarSucursal } from '../../../redux/ducks/alertas'
import Loader from '../../Loader'
import ListaAlertas from './ListaAlertas'
import CajonChat from './CajonChat'
import { obtenerIconoAlerta, obtenerNombrePaciente } from '../../../helpers/alertas'
import CheckboxesTiposAlertas from './CheckboxesTiposAlertas'
import OpcionesAlertas from './OpcionesAlertas'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import _ from 'lodash'

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
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { sucursalSeleccionada } = useSelector(state => state.alertas)
  const { verAlertas } = useSelector(state => state.alertas)
  const dispatch = useDispatch()
  const { id } = useParams()
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
              idPoll: a.poll_id,
              sucursal: a.meta?.sucursal_name,
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

  useEffect(() => {
    if (id && dataAlertas) {
      dataAlertas.forEach((tipoAlertas, tab) => {
        tipoAlertas.alertas.forEach(a => {
          if (a.id === Number(id)) {
            setIdTabAlertasActivo(tabsAlertas[tab].id)
          }
        })
      })
    }
  }, [dataAlertas, id])

  if (cargandoAlertas) {
    return (
      <div className="Alertas__loader">
        <Loader color="#6057f6" />
      </div>
    )
  }

  const sucursales = [...new Set(_.flatten(dataAlertas.map(t => (t.alertas.filter(a => a.sucursal).map(a => a.sucursal)))))]

  const alertasEncuestaSeleccionada = dataAlertas.map(t => {
    const alertasFiltradas = t.alertas
      .filter(a => a.idPoll === idEncuestaSeleccionada)
      .filter(a => !sucursalSeleccionada || a.sucursal === sucursalSeleccionada)
    return {
      ...t,
      conteo: alertasFiltradas.length,
      alertas: alertasFiltradas
    }
  })

  const seleccionAlerta = (
    <>
      <div className="Alertas__lateral">
        <h1 className="Alertas__titulo">Alertas</h1>
        {sucursales.length > 1 && (
          <label>
            <p className="Alertas__label_sucursal">Sucursal</p>
            <select
              className="Alertas__selector_sucursal"
              onChange={e => dispatch(seleccionarSucursal(e.target.value))}
            >
              <option value=''>
                Todas las sucursales
              </option>
              {sucursales.map((s, i) => (
                <option
                  key={`opcion-sucursal-${s}`}
                  value={s}
                >
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
        <CheckboxesTiposAlertas alertas={alertasEncuestaSeleccionada} />
        <OpcionesAlertas />
      </div>
      <div className="Alertas__contenedor_central">
        <div className="Alertas__tabs">
          {alertasEncuestaSeleccionada.map(tipoAlertas => (
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
          alertas={alertasEncuestaSeleccionada}
          idAlertasVisibles={idTabAlertasActivo}
          mostrarSucursal={sucursales.length > 1}
        />
      </div>
    </>
  )

  return (
    <div className="Alertas">
      <div className="Alertas__contenedor">
      <Switch>
        <Route exact path="/alertas">
          {seleccionAlerta}
        </Route>
        <Route path="/alertas/:id">
          {seleccionAlerta}
          <CajonChat />
        </Route>
      </Switch>
      </div>
    </div>
  )
}

export default Alertas
