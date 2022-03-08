import React, { useMemo, useState } from 'react'
import './Alertas.css'
import { alertas as alertasAPI } from '../../../api/endpoints'
import { useQuery } from 'react-query'
import LoaderMensajes from '../Respuestas/Chat/CelularWhatsapp/LoaderMensajes'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import iconoAlertasNoResueltas from '@iconify/icons-mdi/bell-ring'
import iconoAlertasResueltas from '@iconify/icons-mdi/bell-check'

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
  const { isLoading: cargandoAlertas, data: dataAlertas, error: errorAlertas } = useQuery(
    'alertas',
    alertasAPI,
    { refetchInterval: 30_000, refetchOnMount: true }
  )

  const clasificacionAlertas = useMemo(() => {
    if (!dataAlertas) {
      return [[], []]
    }
    return tiposAlertas.map(t => ({
      ...t,
      alertas: dataAlertas.data.data.filter(t.filtro)
    }))
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
            onClick={() => setIdTipoAlertaSeleccionado(tipoAlertas.id)}
          >
            <InlineIcon icon={tipoAlertas.icono} />
            {tipoAlertas.titulo}
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
          >
            {tipoAlertas.alertas.map(alerta => (
            <div className="Alertas__fila" key={`fila-alerta-${alerta.id}`}>
              <div>{alerta.utc_timestamp}</div>
              <div>{alerta.message}</div>
              <div>
                <button>Ver chat</button>
                <button>Marcar como reuelta</button>
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
