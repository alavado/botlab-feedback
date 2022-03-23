import React, { useMemo, useState } from 'react'
import './Alertas.css'
import { alertas as getAlertas, marcarAlerta } from '../../../api/endpoints'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import LoaderMensajes from '../Respuestas/Chat/CelularWhatsapp/LoaderMensajes'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import iconoAlertasNoResueltas from '@iconify/icons-mdi/bell-ring-outline'
import iconoAlertasResueltas from '@iconify/icons-mdi/bell-check-outline'
import iconoWhatsapp from '@iconify/icons-mdi/whatsapp'
import iconoMarcar from '@iconify/icons-mdi/check'
import iconoDesmarcar from '@iconify/icons-mdi/bell-ring'
import { format, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useHistory } from 'react-router-dom'
import data from '@iconify/icons-mdi/check'

export const alertasVisibles = [
  'Número equivocado',
  'Paciente se arrepiente de cancelar su hora',
  'Paciente cancela post confirmación',
  'Paciente reagenda post confirmación',
  'Paciente tiene pregunta o comentario'
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
  const { isLoading: cargandoAlertas, data: dataAlertas } = useQuery(
    'alertas',
    getAlertas,
    {
      refetchInterval: 30_000,
      refetchOnMount: true,
      select: res => res.data
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

  const clasificacionAlertas = useMemo(() => {
    if (!dataAlertas) {
      return [[], []]
    }
    return tiposAlertas.map(t => {
      const alertas = dataAlertas
        .filter(t.filtro)
        .map(a => ({
          ...a,
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
  }, [dataAlertas])

  if (cargandoAlertas) {
    return <LoaderMensajes />
  }

  return (
    <div className="Alertas">
      {/* <h1>Alertas</h1> */}
      <div className="Alertas__contenedor_botones_seleccion_tipo">
        {clasificacionAlertas.map(tipoAlertas => (
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
        {clasificacionAlertas.map(tipoAlertas => (
          <div
            className={classNames({
              "Alertas__lista_alertas": true,
              "Alertas__lista_alertas--visible": idTipoAlertaSeleccionado === tipoAlertas.id,
            })}
            key={`lista-alertas-${tipoAlertas.id}`}
          >
            {tipoAlertas.alertas.map((alerta, i) => (
            <div
              className="Alertas__fila"
              key={`fila-alerta-${alerta.id}`}
              onClick={() => history.push(`/chat/${alerta.poll_id}/${alerta.user_id}`)}
            >
              <div className="Alertas__contenedor_checkbox">
                <div className={classNames({
                  "Alertas__checkbox": true,
                  "Alertas__checkbox--resuelto": alerta.dismissed
                 })} />
              </div>
              <div>{alerta.horaLegible}</div>
              <div>{alerta.message}</div>
              <div className="Alertas__contenedor_acciones">
                <button
                  className="Alertas__boton_accion"
                  onClick={e => {
                    e.stopPropagation()
                    mutation.mutate({ id: alerta.id, dismissed: !alerta.dismissed })
                  }}
                >
                  <InlineIcon icon={alerta.dismissed ? iconoDesmarcar : iconoMarcar} /> Marcar {alerta.dismissed ? 'no resuelta' : 'resuelta'}
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
