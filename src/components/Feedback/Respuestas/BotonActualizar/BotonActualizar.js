import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { differenceInMinutes, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAnalytics from '../../../../hooks/useAnalytics'
import { actualizaRespuestas } from '../../../../redux/ducks/respuestas'
import './BotonActualizar.css'

const BotonActualizar = () => {

  const dispatch = useDispatch()
  const track = useAnalytics()
  const [fechaActual, setFechaActual] = useState(Date.now())
  const { fechaActualizacion, cacheInvalido } = useSelector(state => state.respuestas)

  useEffect(() => {
    const intervalFecha = setInterval(() => setFechaActual(() => Date.now()), 10_000)
    return () => clearInterval(intervalFecha)
  }, [])

  const actualizar = () => {
    track('Feedback', 'Respuestas', 'actualizar')
    dispatch(actualizaRespuestas())
  }

  const alertar = differenceInMinutes(fechaActual, fechaActualizacion) >= 3
  const mensajeActualizacion = `actualizado ${formatDistanceToNow(fechaActualizacion, { locale: es, addSuffix: true })}`

  return (
    <button
      className={classNames({
        "BotonActualizar": true,
        "BotonActualizar--alerta": alertar,
      })}
      tooltip={`Actualizar (${mensajeActualizacion})`}
      onClick={actualizar}
      disabled={cacheInvalido}
    >
      {alertar
        ? <><Icon className="BotonActualizar__icono" icon="mdi:refresh" /></>
        : <><Icon className="BotonActualizar__icono" icon="mdi:refresh" /></>
      }
    </button>
  )
}

export default BotonActualizar