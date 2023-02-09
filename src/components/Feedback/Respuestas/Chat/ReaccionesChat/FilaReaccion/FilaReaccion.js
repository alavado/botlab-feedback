import { InlineIcon } from '@iconify/react'
import { parseISO } from 'date-fns'
import { useParams } from 'react-router-dom'
import { eliminarReaccion } from '../../../../../../api/endpoints'
import './FilaReaccion.css'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { eliminaReaccionDeRespuesta } from '../../../../../../redux/ducks/respuestas'
import useAnalytics from '../../../../../../hooks/useAnalytics'
import { formatearFecha } from '../../../../../../helpers/respuestas'
import InteractionCommentIcon from '../../../../InteractionDrawer/InteractionComments/InteractionCommentIcon'

const FilaReaccion = ({ reaccion, refrescar }) => {
  const { idEncuesta, idUsuario } = useParams()
  const [eliminando, setEliminando] = useState(false)
  const dispatch = useDispatch()
  const track = useAnalytics()

  const clickEnBorrar = () => {
    setEliminando(true)
    eliminarReaccion(idEncuesta, idUsuario, reaccion.id)
      .then(() => {
        track('Feedback', 'Chat', 'eliminarComentario', {
          idEncuesta,
          idUsuario,
          idComentario: reaccion.id,
        })
        dispatch(
          eliminaReaccionDeRespuesta({ idUsuario, fecha: reaccion.created_at })
        )
        refrescar()
      })
      .catch(() => setEliminando(false))
  }

  const fechaAgregadaLegible = formatearFecha(
    parseISO(reaccion.created_at),
    true
  )

  return (
    <div className="FilaReaccion">
      <div className="FilaReaccion__emoji_reaccion">
        <InteractionCommentIcon emoji={reaccion.reaction_emoji} />
      </div>
      <div className="FilaReaccion__texto_reaccion">
        {reaccion.reaction_text || (
          <p className="FilaReaccion__texto_reaccion_sin_comentario">
            Sin comentario
          </p>
        )}
      </div>
      <div className="FilaReaccion__fecha_reaccion">{fechaAgregadaLegible}</div>
      <div className="FilaReaccion__acciones">
        <button
          className="FilaReaccion__boton_eliminar"
          title="Eliminar este comentario"
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
