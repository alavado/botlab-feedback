import { Icon } from '@iconify/react'
import { addDays, addWeeks, endOfWeek, format, isSameDay, isToday, isYesterday, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAnalytics from '../../../../hooks/useAnalytics'
import { guardaRangoFechas } from '../../../../redux/ducks/respuestas'
import Calendario from './Calendario'
import Rangos from './Rangos'
import './SelectorRangoFechas2.css'

const SelectorRangoFechas2 = () => {

  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const [rangoSeleccionado, setRangoSeleccionado] = useState(fechaInicio ? [fechaInicio, fechaTermino] : [new Date(), new Date()])
  const [calendarioVisible, setCalendarioVisible] = useState(false)
  const [rangosVisibles, setRangosVisibles] = useState(false)
  const [etiqueta, setEtiqueta] = useState(format(fechaInicio, 'dd/MM') + ' al ' + format(fechaTermino, 'dd/MM'))
  const dispatch = useDispatch()
  const track = useAnalytics()

  useEffect(() => {
    if (!isSameDay(fechaInicio, rangoSeleccionado[0]) || !isSameDay(fechaTermino, rangoSeleccionado[1])) {
      dispatch(guardaRangoFechas(rangoSeleccionado))
    }
  }, [dispatch, fechaInicio, fechaTermino, rangoSeleccionado])

  return (
    <div className="SelectorRangoFechas2">
      <div
        className="SelectorRangoFechas2__label"
        onClick={() => {
          setCalendarioVisible(true)
          track('Feedback', 'Respuestas', 'calendarioNuevoAbrirConLabel')
        }}
      >
        <Icon icon="mdi:calendar-month" /> Fecha chats
      </div>
      <div className="SelectorRangoFechas2__contenedor_popup">
        <div className="SelectorRangoFechas2__contenedor_botones">
          <button
            className="SelectorRangoFechas2__boton SelectorRangoFechas2__boton--retroceder"
            onClick={() => {
              setRangoSeleccionado(r => [addDays(r[0], -1), addDays(r[0], -1)])
              track('Feedback', 'Respuestas', 'calendarioNuevoDiaAnterior')
            }}
            disabled={!isSameDay(rangoSeleccionado[0], rangoSeleccionado[1])}
            title="Día anterior"
          >
            <Icon icon="mdi:chevron-left" />
          </button>
          <button
            className="SelectorRangoFechas2__boton SelectorRangoFechas2__boton--principal"
            onClick={() => {
              setCalendarioVisible(true)
              track('Feedback', 'Respuestas', 'calendarioNuevoAbrir')
            }}
          >
            {isSameDay(rangoSeleccionado[0], rangoSeleccionado[1])
              ? `${isToday(rangoSeleccionado[0]) ? 'hoy, ' : ''} ${isYesterday(rangoSeleccionado[0]) ? 'ayer, ' : ''} ${format(rangoSeleccionado[0], 'iiii d \'de\' MMMM', { locale: es })}`
              : etiqueta
            }
          </button>
          <button
            className="SelectorRangoFechas2__boton SelectorRangoFechas2__boton--avanzar"
            onClick={() => {
              setRangoSeleccionado(r => [addDays(r[0], 1), addDays(r[0], 1)])
              track('Feedback', 'Respuestas', 'calendarioNuevoDiaSiguiente')
            }}
            disabled={isSameDay(rangoSeleccionado[0], new Date()) || !isSameDay(rangoSeleccionado[0], rangoSeleccionado[1])}
            title="Día siguiente"
          >
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
        {calendarioVisible && (
          <Calendario
            ocultar={() => setCalendarioVisible(false)} 
            seleccionarFecha={f => setRangoSeleccionado([f, f])}
            fechaSeleccionada={rangoSeleccionado[0]}
          />
        )}
      </div>
      <div className="SelectorRangoFechas2__contenedor_popup">
        <button
          className="SelectorRangoFechas2__boton_rango"
          onClick={() => setRangosVisibles(true)}
        >
          <Icon className="SelectorRangoFechas2__icono" icon="mdi:dots-vertical" /> Rango
        </button>
        {rangosVisibles && (
          <Rangos
            ocultar={() => setRangosVisibles(false)}
            rangos={[
              {
                etiqueta: 'Esta semana',
                onClick: () => {
                  const inicio = startOfWeek(new Date(), { locale: es })
                  const termino = endOfWeek(new Date(), { locale: es })
                  setRangoSeleccionado([inicio, termino])
                  setEtiqueta(`Esta semana - ${format(inicio, 'dd/MM')} al ${format(termino, 'dd/MM')}`)
                  track('Feedback', 'Respuestas', 'calendarioNuevoEstaSemana')
                }
              },
              {
                etiqueta: 'Semana pasada',
                onClick: () => {
                  const inicio = startOfWeek(addWeeks(new Date(), -1), { locale: es })
                  const termino = endOfWeek(addWeeks(new Date(), -1), { locale: es })
                  setRangoSeleccionado([inicio, termino])
                  setEtiqueta(`Semana pasada - ${format(inicio, 'dd/MM')} al ${format(termino, 'dd/MM')}`)
                  track('Feedback', 'Respuestas', 'calendarioNuevoSemanaPasada')
                }
              }
            ]}
          />
        )}
      </div>
    </div>
  )
}

export default SelectorRangoFechas2