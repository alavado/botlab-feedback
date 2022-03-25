import React, { useState } from 'react'
import './Alertas.css'
import { alertas as getAlertas, marcarAlerta } from '../../../api/endpoints'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import classNames from 'classnames'
import Icon, { InlineIcon } from '@iconify/react'
import iconoAlertasNoResueltas from '@iconify/icons-mdi/bell-ring-outline'
import iconoAlertasResueltas from '@iconify/icons-mdi/bell-check-outline'
import iconoMarcar from '@iconify/icons-mdi/check-bold'
import iconoDesmarcar from '@iconify/icons-mdi/bell-ring-outline'
import iconoWhatsapp from '@iconify/icons-mdi/whatsapp'
import iconoNumeroEquivocado from '@iconify/icons-mdi/cellphone-off'
import iconoPacienteArrepentido from '@iconify/icons-mdi/account-alert'
import iconoCancelaPostConfirmacion from '@iconify/icons-mdi/account-cancel'
import iconoReagendaPostConfirmacion from '@iconify/icons-mdi/account-edit'
import iconoPregunta from '@iconify/icons-mdi/account-question'
import { format, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { activaNotificaciones, agregaAlertasVisibles, destacaAlerta, remueveAlertasVisibles, limpiaAlertasVisibles } from '../../../redux/ducks/alertas'
import Loader from '../../Loader'

export const alertasVisibles = [
  'Número equivocado',
  'Paciente se arrepiente de cancelar su hora',
  'Paciente cancela post confirmación',
  'Paciente reagenda post confirmación',
  'Paciente tiene pregunta o comentario'
]

export const iconosAlertasVisibles = [
  iconoNumeroEquivocado,
  iconoPacienteArrepentido,
  iconoCancelaPostConfirmacion,
  iconoReagendaPostConfirmacion,
  iconoPregunta
]

const tiposAlertas = [
  {
    id: 1,
    titulo: 'Por resolver',
    icono: iconoAlertasNoResueltas,
    filtro: a => alertasVisibles.indexOf(a.message) >= 0 && !a.dismissed
  },
  {
    id: 2,
    titulo: 'Resueltas',
    icono: iconoAlertasResueltas,
    filtro: a => alertasVisibles.indexOf(a.message) >= 0 && a.dismissed
  }
]

const Alertas = () => {

  const [idTipoAlertaSeleccionado, setIdTipoAlertaSeleccionado] = useState(tiposAlertas[0].id)
  const { idAlertaDestacada, recibirNotificaciones, verAlertas } = useSelector(state => state.alertas)
  const dispatch = useDispatch()
  const { isLoading: cargandoAlertas, data: dataAlertas } = useQuery(
    'alertas',
    getAlertas,
    {
      refetchInterval: 30_000,
      refetchOnMount: true,
      select: res => {
        return tiposAlertas.map(t => {
          const alertas = res.data
            .filter(t.filtro)
            .map(a => ({
              ...a,
              icono: iconosAlertasVisibles[alertasVisibles.findIndex(x => x === a.message)] || iconoWhatsapp,
              horaLegible: !isToday(parseISO(a.utc_timestamp))
                ? format(parseISO(a.utc_timestamp), 'd MMM', { locale: es })
                : format(parseISO(a.utc_timestamp), 'HH:mm', { locale: es }),
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
  const queryClient = useQueryClient()
  const mutation = useMutation(({ id, dismissed }) => marcarAlerta(id, dismissed), {
    onMutate: async ({ id, dismissed }) => {
      await queryClient.cancelQueries('alertas')
      const alertasAntes = queryClient.getQueryData('alertas')
      const nuevaAlerta = alertasAntes.data.find(a => a.id === id)
      nuevaAlerta.dismissed = dismissed
      const nuevasAlertas = {
        ...alertasAntes,
        data: [
          ...alertasAntes.data.filter(a => a.id !== id),
          nuevaAlerta
        ]
      }
      queryClient.setQueryData('alertas', () => nuevasAlertas)
      return { alertasAntes }
    },
    onError: (err, nuevaAlerta, context) => {
      queryClient.setQueryData('alertas', context.alertasAntes)
    },
    onSettled: () => {
      queryClient.invalidateQueries('alertas')
    },
  })
  const history = useHistory()

  return (
    <div className="Alertas">
      <h1 className="Alertas__titulo">Alertas</h1>
      {cargandoAlertas
        ? <div className="Alertas__loader">
            <Loader color="#6057f6" />
          </div>
        : <div className="Alertas__contenedor">
            <div className="Alertas__lateral">
              <h2 className="Alertas__subtitulo">Ver alertas</h2>
              <label
                className="Alertas__contenedor_opcion"
                title="Ver todas las alertas"
              >
                <Icon
                  className="Alertas__icono_checkbox"
                  icon={iconoMarcar}
                />
                <input
                  type="checkbox"
                  className="Alertas__checkbox_opcion"
                  checked={verAlertas?.length === 0}
                  onChange={e => e.target.checked && dispatch(limpiaAlertasVisibles()) }
                /> Todas
              </label>
              {alertasVisibles.map((tipo, i) => (
                <label
                  key={`checkbox-${tipo}`}
                  className="Alertas__contenedor_opcion"
                  title={`Ver alertas con el mensaje \"${tipo}\"`}
                >
                  <Icon
                    className="Alertas__icono_checkbox"
                    icon={iconoMarcar}
                  />
                  <input
                    type="checkbox"
                    className={classNames({
                      "Alertas__checkbox_opcion": true,
                      "Alertas__checkbox_opcion--activo": verAlertas?.indexOf(tipo) >= 0
                    })}
                    checked={verAlertas?.indexOf(tipo) >= 0}
                    onChange={e => {
                      if (e.target.checked) {
                        dispatch(agregaAlertasVisibles(tipo))
                      }
                      else {
                        dispatch(remueveAlertasVisibles(tipo))
                      }
                    }}
                  />
                  <Icon
                    icon={iconosAlertasVisibles[i]}
                    className="Alertas__icono_tipo_alerta"
                  />
                  <span className="Alertas__etiqueta_tipo_alerta">
                    {tipo}
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
                /> {recibirNotificaciones ? 'Recibir notificaciones': 'No recibir notificaciones'}
              </label>
            </div>
            <div className="Alertas__contenedor_secciones_alertas">
              <div className="Alertas__contenedor_botones_seleccion_tipo">
                {dataAlertas.map(tipoAlertas => (
                  <button
                    key={`boton-tipo-alertas-${tipoAlertas.id}`}
                    className={classNames({
                      "Alertas__boton_tab": true,
                      "Alertas__boton_tab--activo": idTipoAlertaSeleccionado === tipoAlertas.id,
                    })}
                    onClick={() => setIdTipoAlertaSeleccionado(tipoAlertas.id)}
                  >
                    <InlineIcon className="Alertas__icono_tab" icon={tipoAlertas.icono} />
                    <p className="Alertas__boton_tab_titulo">{tipoAlertas.titulo}</p>
                    <p className="Alertas__boton_tab_subtitulo">{tipoAlertas.conteo} alerta{tipoAlertas.conteo !== 1 && 's'}</p>
                  </button>
                ))}
              </div>
              <div className="Alertas__contenedor_listas_alertas">
                {dataAlertas.map((tipoAlertas, indiceTipoAlerta) => (
                  <div
                    className={classNames({
                      "Alertas__lista_alertas": true,
                      "Alertas__lista_alertas--visible": idTipoAlertaSeleccionado === tipoAlertas.id,
                    })}
                    key={`lista-alertas-${tipoAlertas.id}`}
                  >
                    {tipoAlertas.alertas.map(alerta => (
                      <div
                        className={classNames({
                          "Alertas__fila": true,
                          "Alertas__fila--destacada": alerta.id === idAlertaDestacada,
                          "Alertas__fila--derecha": indiceTipoAlerta > 0,
                          "Alertas__fila--oculta": verAlertas?.length > 0 && verAlertas.indexOf(alerta.message) < 0
                        })}
                        key={`fila-alerta-${alerta.id}`}
                        onClick={() => {
                          dispatch(destacaAlerta({ id: alerta.id }))
                          history.push(`/chat/${alerta.poll_id}/${alerta.user_id}`, { from: '/alertas' })
                        }}
                      >
                        <Icon
                          icon={alerta.icono}
                          className="Alertas__fila_icono"
                        />
                        {/* <div className="Alertas__contenedor_checkbox">
                          <div className={classNames({
                            "Alertas__checkbox": true,
                            "Alertas__checkbox--resuelto": alerta.dismissed
                          })} />
                        </div> */}
                        <div style={{ paddingLeft: '.5rem' }}>{alerta.horaLegible}</div>
                        <div>{alerta.message}</div>
                        <div
                          className="Alertas__contenedor_acciones"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            className="Alertas__boton_accion"
                            onClick={() => mutation.mutate({ id: alerta.id, dismissed: !alerta.dismissed }) }
                          >
                            <InlineIcon icon={alerta.dismissed ? iconoDesmarcar : iconoMarcar} /> Marcar como {alerta.dismissed ? 'no resuelta' : 'resuelta'}
                          </button>
                          <button
                            className="Alertas__boton_accion"
                            onClick={e => {
                              e.stopPropagation()
                              history.push(`/chat/${alerta.poll_id}/${alerta.user_id}`)
                            }}
                          >
                            <InlineIcon icon={iconoWhatsapp} /> Ver chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
      }
      {/* <div>
        {alertasNoResueltas.map((alerta, i) => (
          <div className="Alertas__fila" key={`fila-alerta-${i}`}>
            <div>{alerta.utc_timestamp}</div>
            <div>{alerta.message}</div>
            <div>
              <button>Ver chat</button>
              <button>Marcar como reuelta</button>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default Alertas
