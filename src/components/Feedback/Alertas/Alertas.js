import React, { useMemo, useState } from 'react'
import './Alertas.css'
import { alertas as getAlertas, marcarAlerta } from '../../../api/endpoints'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import LoaderMensajes from '../Respuestas/Chat/CelularWhatsapp/LoaderMensajes'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import iconoAlertasNoResueltas from '@iconify/icons-mdi/bell-ring-outline'
import iconoAlertasResueltas from '@iconify/icons-mdi/bell-check-outline'
import { differenceInDays, format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useHistory } from 'react-router-dom'

const tiposAlertas = [
  {
    id: 1,
    titulo: 'Alertas no resueltas',
    icono: iconoAlertasNoResueltas,
    filtro: a => !a.dismissed
  },
  {
    id: 2,
    titulo: 'Alertas resueltas',
    icono: iconoAlertasResueltas,
    filtro: a => a.dismissed
  }
]

const Alertas = () => {

  const [idTipoAlertaSeleccionado, setIdTipoAlertaSeleccionado] = useState(tiposAlertas[0].id)
  const { isLoading: cargandoAlertas, data: dataAlertas } = useQuery(
    'alertas',
    getAlertas,
    { refetchInterval: 30_000, refetchOnMount: true }
  )
  const queryClient = useQueryClient()
  const mutation = useMutation((id, dismissed) => marcarAlerta(id, dismissed), {
    // When mutate is called:
    // onMutate: async idAlerta => {
    //   // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries(['alertas', newTodo.id])
  
    //   // Snapshot the previous value
    //   const previousTodo = queryClient.getQueryData(['alertas', newTodo.id])
  
    //   // Optimistically update to the new value
    //   queryClient.setQueryData(['alertas', newTodo.id], newTodo)
  
    //   // Return a context with the previous and new todo
    //   return { previousTodo, newTodo }
    // },
    // // If the mutation fails, use the context we returned above
    // onError: (err, newTodo, context) => {
    //   queryClient.setQueryData(
    //     ['alertas', context.newTodo.id],
    //     context.previousTodo
    //   )
    // },
    // // Always refetch after error or success:
    // onSettled: newTodo => {
    //   queryClient.invalidateQueries(['alertas', newTodo.id])
    // },
  })
  const history = useHistory()

  const clasificacionAlertas = useMemo(() => {
    if (!dataAlertas) {
      return [[], []]
    }
    return tiposAlertas.map(t => {
      const alertas = dataAlertas.data.data
        .filter(t.filtro)
        .map(a => ({
          ...a,
          horaLegible: differenceInDays(Date.now(), parseISO(a.utc_timestamp)) > 2
            ? format(parseISO(a.utc_timestamp), 'EEEE d \'de\' MMMM', { locale: es })
            : formatDistanceToNow(parseISO(a.utc_timestamp), { locale: es, addSuffix: true, includeSeconds: false }),
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
              "Alertas__boton_tab--activo": idTipoAlertaSeleccionado === tipoAlertas.id
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
            {tipoAlertas.alertas.map(alerta => (
            <div className="Alertas__fila" key={`fila-alerta-${alerta.id}`}>
              <div>{alerta.horaLegible}</div>
              <div>{alerta.message}</div>
              <div className="Alertas__contenedor_acciones">
                <button
                  className="Alertas__boton_accion"
                  onClick={() => mutation.mutate(alerta.id, !alerta.dismissed)}
                >
                  Marcar como resuelta
                </button>
                <button
                  className="Alertas__boton_accion"
                  onClick={() => history.push(`/chat/${alerta.poll_id}/${alerta.user_id}`)}
                >
                  Ver chat
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
