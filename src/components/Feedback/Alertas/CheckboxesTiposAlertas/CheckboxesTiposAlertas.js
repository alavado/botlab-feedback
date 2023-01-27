import { useMemo } from 'react'
import { Icon, InlineIcon } from '@iconify/react'
import {
  agregaAlertasVisibles,
  mensajesAlertasVisibles,
  remueveAlertasVisibles,
} from '../../../../redux/ducks/alertas'
import {
  obtenerEtiquetaAlerta,
  obtenerIconoAlerta,
} from '../../../../helpers/alertas'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import './CheckboxesTiposAlertas.css'
import useAnalytics from '../../../../hooks/useAnalytics'

const CheckboxesTiposAlertas = ({ alertas }) => {
  const { verAlertas } = useSelector((state) => state.alertas)
  const track = useAnalytics()
  const dispatch = useDispatch()

  const tiposAlertasConConteos = useMemo(() => {
    if (!alertas) {
      return []
    }
    return mensajesAlertasVisibles.map((nombre) => ({
      nombre,
      conteo: alertas
        .find((t) => t.titulo === 'Por resolver')
        .alertas.filter((a) => a.message === nombre).length,
    }))
  }, [alertas])

  return (
    <div className="CheckboxesTiposAlertas">
      <h2 className="CheckboxesTiposAlertas__titulo">Ver alertas</h2>
      {tiposAlertasConConteos.map(({ nombre, conteo }, i) => (
        <label
          key={`checkbox-${nombre}`}
          className="CheckboxesTiposAlertas__contenedor_opcion"
          title={`${
            verAlertas?.indexOf(nombre) >= 0 ? 'Ocultar' : 'Ver'
          } alertas con el mensaje "${nombre}"`}
        >
          <Icon
            className="CheckboxesTiposAlertas__icono_checkbox"
            icon="mdi:check-bold"
          />
          <input
            type="checkbox"
            className={classNames({
              CheckboxesTiposAlertas__checkbox_opcion: true,
              'CheckboxesTiposAlertas__checkbox_opcion--activo':
                verAlertas?.indexOf(nombre) >= 0,
            })}
            checked={verAlertas?.indexOf(nombre) >= 0}
            onChange={(e) => {
              if (e.target.checked) {
                track('Feedback', 'Alertas', 'verTipoAlertas', { nombre })
                dispatch(agregaAlertasVisibles(nombre))
              } else {
                track('Feedback', 'Alertas', 'ocultarTipoAlertas', { nombre })
                dispatch(remueveAlertasVisibles(nombre))
              }
            }}
          />
          <Icon
            icon={obtenerIconoAlerta(nombre)}
            className="CheckboxesTiposAlertas__icono_tipo_alerta"
          />
          <span className="CheckboxesTiposAlertas__etiqueta_tipo_alerta">
            {obtenerEtiquetaAlerta(nombre)}
          </span>
          <span className="CheckboxesTiposAlertas__conteo_tipo_alerta">
            {conteo === 0 ? (
              <>
                <InlineIcon icon="mdi:check" /> Sin alertas por resolver
              </>
            ) : (
              <>
                <InlineIcon icon="mdi:bell-ring-outline" /> {conteo} alerta
                {conteo !== 1 ? 's' : ''} por resolver
              </>
            )}
          </span>
        </label>
      ))}
    </div>
  )
}

export default CheckboxesTiposAlertas
