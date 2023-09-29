import { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import './PopupEncuestas.css'
import { obtenerPollsCalculadas } from '../../../../../helpers/pollsCalculadas'
import { obtenerTiposEncuestasVisibles } from '../../../../../helpers/encuestasSecretas'
import useAnalytics from '../../../../../hooks/useAnalytics'
import { formatearNombreEncuesta } from '../../../../../helpers/respuestas'

const PopupEncuestas = ({ activo, esconder, verEncuesta }) => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { cuenta, nombreUsuario } = useSelector(state => state.login)
  const { respuestas } = useSelector(state => state.respuestas)
  const track = useAnalytics()
  
  const tiposOrdenados = useMemo(() => {
    const encuestaSeleccionada = tipos.find(({ id }) => id === idEncuestaSeleccionada)
    const encuestasCalculadas = obtenerPollsCalculadas(encuestaSeleccionada, respuestas)
    let tiposEncuestas = [
      encuestaSeleccionada,
      ...encuestasCalculadas,
      ...tipos.filter(({ id }) => id !== idEncuestaSeleccionada)
    ]
    return obtenerTiposEncuestasVisibles(cuenta, tiposEncuestas)
  }, [tipos, idEncuestaSeleccionada, respuestas, cuenta])

  return <>
      {ReactDOM.createPortal(
      <div
        className={classNames({
          'PopupEncuestas__lamina': true,
          'PopupEncuestas__lamina--activo': activo
        })}
        style={{ pointerEvents: activo ? 'all' : 'none' }}
        onClick={e => {
          esconder()
          e.stopPropagation()
        }}
      >
      </div>, document.getElementById('popup-encuestas'))}
      <div
        className="PopupEncuestas" 
        style={{
          pointerEvents: activo ? 'all' : 'none',
          opacity: activo ? 1 : 0
        }}
      >
        {tiposOrdenados.map(({ id, nombre, enabled, icono }) => (
          <div
            key={`boton-${id}`}
            onClick={e => {
              track('Feedback', 'Respuestas', 'verEncuestaConSelector', { idEncuesta: id, nombreEncuesta: nombre })
              verEncuesta(id)
              esconder()
              e.stopPropagation()
            }}
            className={classNames({
              "PopupEncuestas__opcion": true,
              "PopupEncuestas__opcion--indentada": icono
            })}
          >
            <Icon
              className="PopupEncuestas__icono_empresa"
              icon={icono || 'mdi:whatsapp'}
              style={{ color: enabled ? '#48BB78' : '#9f9eae' }}
            />
            <div className="PopupEncuestas__nombre_encuesta">
              {formatearNombreEncuesta(nombreUsuario, nombre)}
            </div>
          </div>
        ))}
      </div>
    </>
}

export default PopupEncuestas
