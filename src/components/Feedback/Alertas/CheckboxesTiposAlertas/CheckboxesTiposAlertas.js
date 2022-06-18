import { useMemo } from 'react'
import { Icon, InlineIcon } from '@iconify/react'
import iconoMarcar from '@iconify/icons-mdi/check-bold'
import iconoSinAlertasPorResolver from '@iconify/icons-mdi/check'
import iconoAlertasNoResueltas from '@iconify/icons-mdi/bell-ring-outline'
import { agregaAlertasVisibles, mensajesAlertasVisibles, remueveAlertasVisibles } from '../../../../redux/ducks/alertas'
import { obtenerEtiquetaAlerta, obtenerIconoAlerta } from '../../../../helpers/alertas'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import './CheckboxesTiposAlertas.css'

const CheckboxesTiposAlertas = ({ alertas }) => {

  const { verAlertas } = useSelector(state => state.alertas)
  const dispatch = useDispatch()

  const tiposAlertasConConteos = useMemo(() => {
    if (!alertas) {
      return []
    }
    return mensajesAlertasVisibles.map(nombre => ({
      nombre,
      conteo: alertas
        .find(t => t.titulo === 'Por resolver')
        .alertas
        .filter(a => a.message === nombre)
        .length
    }))
  }, [alertas])

  return (
    <div className="CheckboxesTiposAlertas">
      <h2 className="CheckboxesTiposAlertas__titulo">Ver alertas</h2>
        {tiposAlertasConConteos.map(({ nombre, conteo }, i) => (
          <label
            key={`checkbox-${nombre}`}
            className="CheckboxesTiposAlertas__contenedor_opcion"
            title={`${verAlertas?.indexOf(nombre) >= 0 ? 'Ocultar' : 'Ver'} alertas con el mensaje "${nombre}"`}
          >
            <Icon
              className="CheckboxesTiposAlertas__icono_checkbox"
              icon={iconoMarcar}
            />
            <input
              type="checkbox"
              className={classNames({
                "CheckboxesTiposAlertas__checkbox_opcion": true,
                "CheckboxesTiposAlertas__checkbox_opcion--activo": verAlertas?.indexOf(nombre) >= 0
              })}
              checked={verAlertas?.indexOf(nombre) >= 0}
              onChange={e => {
                if (e.target.checked) {
                  dispatch(agregaAlertasVisibles(nombre))
                }
                else {
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
              {conteo === 0
                ? <><InlineIcon icon={iconoSinAlertasPorResolver} /> Sin alertas por resolver</>
                : <><InlineIcon icon={iconoAlertasNoResueltas} /> {conteo} alerta{conteo !== 1 ? 's' : ''} por resolver</>
              }
            </span>
          </label>
        ))}
    </div>
  )
}

export default CheckboxesTiposAlertas