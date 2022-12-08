import { Icon, InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import './CajonInteraccion.css'
import { escondeCajonInteraccion } from '../../../../redux/ducks/servicio'
import { useComentariosInteraccionActivaQuery, useInteraccionActivaQuery } from '../../../../api/hooks'
import AvatarUsuarios from './AvatarUsuarios'
import { formatearCampoRespuestas } from '../../../../helpers/respuestas'
import MensajesInteraccion from './MensajesInteraccion'
import { Fragment } from 'react'
import Loader from '../../../Loader'

const CajonInteraccion = () => {

  const { cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  const { data } = useInteraccionActivaQuery()
  const { isLoading: cargandoComentarios } = useComentariosInteraccionActivaQuery()

  return (
    <div className={classNames({
      "CajonInteraccion": true,
      "CajonInteraccion--visible": cajonInteraccionVisible
    })}>
      <button
        className={
          classNames({
            "CajonInteraccion__boton_cerrar": true,
            "CajonInteraccion__boton_cerrar--visible": cajonInteraccionVisible,
          })
        }
        onClick={e => {
          e.stopPropagation()
          dispatch(escondeCajonInteraccion())
        }}
      >
        <Icon icon="mdi:chevron-double-right" />
      </button>
      <div className="CajonInteraccion__superior">
        <div className="CajonInteraccion__superior_avatar">
          <AvatarUsuarios />
        </div>
        <h2 className="CajonInteraccion__titulo">
          {data?.appointments
            ? data.appointments.length > 1
              ? <>
                  {data.appointments.map((cita, i) => (
                    <Fragment key={`CajonInteraccion-icono-cita-${i}`}>
                      {cita.patientName.split(' ')[0]}
                      <span
                        className="CajonInteraccion__estado_interaccion"
                        title={cita.status?.explicacion}
                        style={{
                          boxShadow: `
                            0 0 0 .35rem ${cita.status?.color},
                            .2rem 0 0 .35rem ${cita.status?.color}
                          `,
                          background: cita.status?.color
                        }}
                      >
                        <InlineIcon icon={cita.status?.icono || 'mdi:clock'} />
                        {cita.status?.descripcion}
                      </span>
                      {i < data.appointments.length - 1 && ', '}
                    </Fragment>
                  ))}
                </>
              : <>
                  {data.appointments[0].patientName}
                  <span
                    className="CajonInteraccion__estado_interaccion"
                    title={data.appointments[0].status?.explicacion}
                    style={{
                      boxShadow: `
                        0 0 0 .35rem ${data.appointments[0].status?.color},
                        .2rem 0 0 .35rem ${data.appointments[0].status?.color}
                      `,
                      background: data.appointments[0].status?.color
                    }}
                  >
                    <InlineIcon
                      icon={data.appointments[0].status?.icono || 'mdi:clock'}
                    />
                    {data.appointments[0].status?.descripcion}
                  </span>
                </>
            : 'Cargando...'
          }
        </h2>
        <div className="CajonInteraccion__botones_acciones">
          
        </div>
        <p className="CajonInteraccion__subtitulo">
          {data?.telefonoUsuario
            ? formatearCampoRespuestas(data.telefonoUsuario, 'phone')
            : <span className="CajonInteraccion__skeleton_telefono" />
          }
        </p>
      </div>
      <div className="CajonInteraccion__principal">
        <div className="CajonInteraccion__telefono">
          <div className="CajonInteraccion__telefono_barra">
            
          </div>
          <div className="CajonInteraccion__telefono_mensajes">
            {data?.conversaciones && !cargandoComentarios
              ? <MensajesInteraccion />
              : <div className="CajonInteraccion__loader">
                  <Loader color="var(--color-texto)" />
                </div>
            }
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button>Chatear con paciente</button>
        <button>Ver cita en Dentalink</button>
        <button>Reportar problema</button>
        </div>
      </div>
    </div>
  )
}

export default CajonInteraccion