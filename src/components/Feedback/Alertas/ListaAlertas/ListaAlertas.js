import Icon, { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useMutation, useQueryClient } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { marcarAlerta } from '../../../../api/endpoints'
import { destacaAlerta } from '../../../../redux/ducks/alertas'
import iconoMarcar from '@iconify/icons-mdi/check-bold'
import iconoDesmarcar from '@iconify/icons-mdi/bell-ring-outline'
import iconoMarcaChatActivo from '@iconify/icons-mdi/chevron-right'
import './ListaAlertas.css'
import { obtenerEtiquetaAlerta } from '../../../../helpers/alertas'
import Scrambler from '../../../Scrambler/Scrambler'

const ListaAlertas = ({ alertas, idAlertasVisibles, mostrarCajon }) => {

  const dispatch = useDispatch()
  const { idAlertaDestacada, verAlertas } = useSelector(state => state.alertas)

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

  return (
    <>
      {alertas.map((tipoAlertas, indiceTipoAlerta) => (
        <div
          className={classNames({
            "ListaAlertas": true,
            "ListaAlertas--visible": idAlertasVisibles === tipoAlertas.id,
          })}
          key={`lista-alertas-${tipoAlertas.id}`}
        >
          {tipoAlertas.alertas.map(alerta => (
            <div
              className={classNames({
                "ListaAlertas__fila": true,
                "ListaAlertas__fila--destacada": alerta.id === idAlertaDestacada,
                "ListaAlertas__fila--derecha": indiceTipoAlerta > 0,
                "ListaAlertas__fila--oculta": verAlertas?.indexOf(alerta.message) < 0,
                "ListaAlertas__fila--resuelta": alerta.dismissed
              })}
              key={`fila-alerta-${alerta.id}`}
              onClick={e => {
                e.stopPropagation()
                dispatch(destacaAlerta({ id: alerta.id }))
                mostrarCajon()
              }}
            >
              <div className="ListaAlertas__contenedor_hora">
                <div className="ListaAlertas__marca_alerta" />
                {alerta.horaLegible}
              </div>
              <Icon
                icon={alerta.icono}
                className="ListaAlertas__fila_icono"
              />
              {/* <div className="ListaAlertas__contenedor_checkbox">
                <div className={classNames({
                  "ListaAlertas__checkbox": true,
                  "ListaAlertas__checkbox--resuelto": alerta.dismissed
                })} />
              </div> */}
              <div className="ListaAlertas__mensaje">
                <p>{obtenerEtiquetaAlerta(alerta.message)}</p>
                <p className="ListaAlertas__subtitulo">
                  <Scrambler tipo="nombre">{alerta.nombrePaciente}</Scrambler>
                </p>
              </div>
              {alerta.id === idAlertaDestacada
                ? <div
                    className="ListaAlertas__contenedor_acciones"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="ListaAlertas__boton_accion"
                      onClick={() => mutation.mutate({ id: alerta.id, dismissed: !alerta.dismissed }) }
                    >
                      <InlineIcon icon={alerta.dismissed ? iconoDesmarcar : iconoMarcar} /> Marcar {alerta.dismissed ? 'no resuelta' : 'resuelta'}
                    </button>
                    {/* <button
                      className="ListaAlertas__boton_accion"
                      onClick={e => {
                        e.stopPropagation()
                        history.push(`/chat/${alerta.poll_id}/${alerta.user_id}`, { from: '/alertas' })
                      }}
                    >
                      <InlineIcon icon={iconoWhatsapp} /> Ver chat
                    </button> */}
                  </div>
                : <></>
              }
              <Icon
                className={classNames({
                  "ListaAlertas__icono_fila_activa": true,
                  "ListaAlertas__icono_fila_activa--activa": alerta.id === idAlertaDestacada,
                })}
                icon={iconoMarcaChatActivo}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default ListaAlertas