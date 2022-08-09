import { InlineIcon } from '@iconify/react'
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useParams } from 'react-router-dom'
import { eliminarReaccion } from '../../../../../../api/endpoints'
import './FilaReaccion.css'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { eliminaReaccionDeRespuesta } from '../../../../../../redux/ducks/respuestas'
import useAnalytics from '../../../../../../hooks/useAnalytics'

const FilaReaccion = ({ reaccion, refrescar }) => {

  const { idEncuesta, idUsuario } = useParams()
  const [eliminando, setEliminando] = useState(false)
  const dispatch = useDispatch()
  const track = useAnalytics()

  const clickEnBorrar = () => {
    setEliminando(true)
    eliminarReaccion(idEncuesta, idUsuario, reaccion.id)
      .then(() => {
        track('Feedback', 'Chat', 'eliminarComentario', { idEncuesta, idUsuario, idComentario: reaccion.id })
        dispatch(eliminaReaccionDeRespuesta({ idUsuario, fecha: reaccion.created_at }))
        refrescar()
      })
      .catch(() => setEliminando(false))
  }

  const fechaAgregada = parseISO(reaccion.created_at)
  const fechaAgregadaLegible = (isYesterday(fechaAgregada) ? 'ayer, ' : '') + (isToday(fechaAgregada) ? 'hoy, ' : '') + (isTomorrow(fechaAgregada) ? 'mañana, ' : '') + format(fechaAgregada, 'EEEE d \'de\' MMMM \'a las\' HH:mm', { locale: es })
  const tooltipFechaAgregada = format(parseISO(reaccion.created_at), `iiii d 'de' MMMM 'de' yyyy 'a las' HH:mm`, { locale: es })

  return (
    <div className="FilaReaccion">
      <div className="FilaReaccion__emoji_reaccion">
        {reaccion.reaction_emoji}
      </div>
      <div className="FilaReaccion__texto_reaccion">
        {reaccion.reaction_text || <p className="FilaReaccion__texto_reaccion_sin_comentario">Sin comentario</p>}
      </div>
      <div
        className="FilaReaccion__fecha_reaccion"
        title={tooltipFechaAgregada}
      >
        {fechaAgregadaLegible}
      </div>
      <div className="FilaReaccion__acciones">
        <button
          className="FilaReaccion__boton_eliminar"
          title="Eliminar esta nota"
          onClick={clickEnBorrar}
          disabled={eliminando}
        >
          <InlineIcon icon="mdi:delete" />
        </button>
      </div>
    </div>
  )
}

export default FilaReaccion