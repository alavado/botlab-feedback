import { getHours, getMinutes, parseISO } from 'date-fns'
import './RelojSimpatico.css'

const RelojSimpatico = ({ horaISO }) => {

  console.log(horaISO)

  const tiempo = parseISO(horaISO)
  const horas = getHours(tiempo)
  const minutos = getMinutes(tiempo)

  console.log({ horas, minutos })

  return (
    <span className="RelojSimpatico">
      <div
        className="RelojSimpatico__cara" 
        style={{
          transform: `rotate(${360 * (horas % 12) / 12}deg)`
        }}
      >
        <div className="RelojSimpatico__horario" />
      </div>
      <div
        className="RelojSimpatico__cara" 
        style={{
          transform: `rotate(${360 * minutos / 60}deg)`
        }}
      >
        <div className="RelojSimpatico__minutero" />
      </div>
    </span>
  )
}

export default RelojSimpatico