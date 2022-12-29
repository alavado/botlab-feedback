import { Icon, InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useMutation, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { marcarAlerta } from '../../../../api/endpoints'
import './ListaAlertas.css'
import { obtenerEtiquetaAlerta } from '../../../../helpers/alertas'
import Scrambler from '../../../Scrambler/Scrambler'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import useAnalytics from '../../../../hooks/useAnalytics'

const ListaAlertas = ({ alertas, idAlertasVisibles, mostrarSucursal }) => {
  const { id } = useParams()
  const { verAlertas } = useSelector((state) => state.alertas)
  const history = useHistory()
  const track = useAnalytics()

  const queryClient = useQueryClient()
  const mutation = useMutation(
    ({ id, dismissed }) => marcarAlerta(id, dismissed),
    {
      onMutate: async ({ id, dismissed }) => {
        await queryClient.cancelQueries('alertas')
        const alertasAntes = queryClient.getQueryData('alertas')
        const nuevaAlerta = alertasAntes.data.find((a) => a.id === id)
        nuevaAlerta.dismissed = dismissed
        const nuevasAlertas = {
          ...alertasAntes,
          data: [...alertasAntes.data.filter((a) => a.id !== id), nuevaAlerta],
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
    }
  )

  return (
    <>
      {alertas.map((tipoAlertas, indiceTipoAlerta) => (
        <div
          className={classNames({
            ListaAlertas: true,
            'ListaAlertas--visible': idAlertasVisibles === tipoAlertas.id,
          })}
          key={`lista-alertas-${tipoAlertas.id}`}
        >
          {tipoAlertas.alertas.map((alerta) => (
            <div
              className={classNames({
                ListaAlertas__fila: true,
                'ListaAlertas__fila--destacada': alerta.id === Number(id),
                'ListaAlertas__fila--derecha': indiceTipoAlerta > 0,
                'ListaAlertas__fila--oculta':
                  verAlertas?.indexOf(alerta.message) < 0,
                'ListaAlertas__fila--resuelta': alerta.dismissed,
              })}
              key={`fila-alerta-${alerta.id}`}
              onClick={(e) => {
                e.stopPropagation()
                track('Feedback', 'Alertas', 'verChatAlertaEnCajon', {
                  idAlerta: alerta.id,
                })
                history.push(`/alertas/${alerta.id}`)
                // dispatch(destacaAlerta({ id: alerta.id }))
                // mostrarCajon()
              }}
              title="Ver conversación"
            >
              <div className="ListaAlertas__contenedor_hora">
                <div
                  className="ListaAlertas__marca_alerta"
                  title={
                    alerta.dismissed
                      ? 'Esta alerta ya fue resuelta'
                      : 'Esta alerta aún no ha sido resuelta'
                  }
                />
                {alerta.horaLegible}
              </div>
              <Icon icon={alerta.icono} className="ListaAlertas__fila_icono" />
              <div className="ListaAlertas__mensaje">
                <p>{obtenerEtiquetaAlerta(alerta.message)}</p>
                <p className="ListaAlertas__subtitulo">
                  <Scrambler tipo="nombre">{alerta.nombrePaciente}</Scrambler>{' '}
                  {mostrarSucursal && alerta.sucursal && (
                    <span> • {alerta.sucursal}</span>
                  )}{' '}
                  {alerta.resueltaPor && (
                    <>
                      <InlineIcon icon="mdi:check" /> Resuelta por:{' '}
                      <InlineIcon icon="mdi:user" /> {alerta.resueltaPor}
                    </>
                  )}
                </p>
              </div>
              {alerta.id === Number(id) && (
                <div
                  className="ListaAlertas__contenedor_acciones"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="ListaAlertas__boton_accion"
                    onClick={() => {
                      track(
                        'Feedback',
                        'Alertas',
                        alerta.dismissed
                          ? 'marcarAlertaComoNoResuelta'
                          : 'marcarAlertaComoResuelta',
                        { idAlerta: alerta.id }
                      )
                      mutation.mutate({
                        id: alerta.id,
                        dismissed: !alerta.dismissed,
                      })
                    }}
                    title={
                      alerta.dismissed
                        ? 'Marcar que alerta no ha sido resuelta'
                        : 'Marcar que alerta fue resuelta'
                    }
                  >
                    <InlineIcon
                      icon={
                        alerta.dismissed
                          ? 'mdi:bell-ring-outline'
                          : 'mdi:check-bold'
                      }
                    />{' '}
                    Marcar {alerta.dismissed ? 'no resuelta' : 'resuelta'}
                  </button>
                </div>
              )}
              <Icon
                className={classNames({
                  ListaAlertas__icono_fila_activa: true,
                  'ListaAlertas__icono_fila_activa--activa':
                    alerta.id === Number(id),
                })}
                icon="mdi-chevron-right"
              />
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default ListaAlertas
