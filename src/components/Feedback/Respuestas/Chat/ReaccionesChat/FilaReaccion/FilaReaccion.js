import { InlineIcon } from '@iconify/react'
import iconoEliminar from '@iconify/icons-mdi/delete'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useParams } from 'react-router-dom'
import { eliminarReaccion } from '../../../../../../api/endpoints'
import './FilaReaccion.css'
import { useState } from 'react'

const FilaReaccion = ({ reaccion, refrescar }) => {

  const { idEncuesta, idUsuario } = useParams()
  const [eliminando, setEliminando] = useState(false)

  const clickEnBorrar = () => {
    setEliminando(true)
    eliminarReaccion(idEncuesta, idUsuario, reaccion.id)
      .then(refrescar)
      .catch(() => setEliminando(false))
  }

  const fechaAgregada = formatDistanceToNow(parseISO(reaccion.created_at), { locale: es, addSuffix: true, includeSeconds: false })
  const tooltipFechaAgregada = format(parseISO(reaccion.created_at), `d 'de' MMMM 'de' yyyy 'a las' HH:mm`, { locale: es })

  return (
    <div className="FilaReaccion">
      <div className="FilaReaccion__emoji_reaccion">
        {reaccion.reaction_emoji}
      </div>
      <div className="FilaReaccion__texto_reaccion">
        {reaccion.reaction_text}
      </div>
      <div
        className="FilaReaccion__fecha_reaccion"
        title={tooltipFechaAgregada}
      >
        agregada {fechaAgregada}
      </div>
      <div className="FilaReaccion__acciones">
        <button
          className="FilaReaccion__boton_eliminar"
          title="Eliminar esta nota"
          onClick={clickEnBorrar}
          disabled={eliminando}
        >
          <InlineIcon icon={iconoEliminar} />
        </button>
      </div>
    </div>
  )
}

export default FilaReaccion