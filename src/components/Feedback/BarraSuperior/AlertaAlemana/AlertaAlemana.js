import { useSelector } from 'react-redux'
import './AlertaAlemana.css'

const AlertaAlemana = () => {
  const { idEncuestaSeleccionada } = useSelector((state) => state.encuestas)

  if (idEncuestaSeleccionada !== 457) {
    return null
  }

  return (
    <div className="AlertaAlemana">
      Desde el 1 de marzo de 2023 este servicio ya no sigue vigente. Para
      continuar con el servicio, comunícate con Felipe Rodríguez (fr@cero.ai)
    </div>
  )
}

export default AlertaAlemana
