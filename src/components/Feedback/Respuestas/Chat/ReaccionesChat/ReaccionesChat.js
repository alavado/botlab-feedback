import { InlineIcon } from '@iconify/react'
import { format, parseISO } from 'date-fns'
import { formatDistanceToNow } from 'date-fns/esm'
import { es } from 'date-fns/locale'
import iconoAgregar from '@iconify/icons-mdi/add-box'
import './ReaccionesChat.css'
import { useEffect, useRef, useState } from 'react'
import { agregarReaccion } from '../../../../../api/endpoints'
import { useParams } from 'react-router-dom'
import LoaderChat from '../LoaderChat'

const obtenerEmoji = texto => {
  switch (texto) {
    case ':smile:': return '😊'
    case ':sad:': return '😢'
    default: return texto
  }
}

const ReaccionesChat = ({ reacciones, start }) => {

  const [formularioActivo, setFormularioActivo] = useState(false)
  const [comentario, setComentario] = useState('')
  const [emoji, setEmoji] = useState('✅')
  const inputRef = useRef()
  const { idEncuesta, idUsuario } = useParams()

  useEffect(() => {
    if (formularioActivo) {
      inputRef.current?.focus()
    }
  }, [formularioActivo])

  const agregarComentario = () => {
    setFormularioActivo(false)
    agregarReaccion(idEncuesta, idUsuario, start, emoji, comentario)
    setComentario('')
  }

  if (!reacciones) {
    return null
  }

  return (
    <div className="ReaccionesChat">
      <div className="ReaccionesChat__superior">
        <h2 className="ReaccionesChat__titulo">Notas</h2>
        <button
          className="ReaccionesChat__boton_agregar"
          onClick={() => setFormularioActivo(true)}
        >
          <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoAgregar} /> Agregar
        </button>
      </div>
      <div className="ReaccionesChat__contenedor_lista">
        {formularioActivo &&
          <div className="ReaccionesChat__fila_reaccion">
            <div className="ReaccionesChat__emoji_reaccion">
              <button>{emoji}</button>
            </div>
            <div className="ReaccionesChat__texto_reaccion">
              <input
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                ref={inputRef}
                placeholder="Comentario (opcional)"
              >

              </input>
            </div>
            <div className="ReaccionesChat__fecha_reaccion">
              <button onClick={agregarComentario}>agregar</button>
              <button onClick={() => setFormularioActivo(false)}>cancelar</button>
            </div>
          </div>
        }
        {reacciones.map((reaccion, i) => (
          <div
            key={`reaccion-chat-${i}`}
            className="ReaccionesChat__fila_reaccion"
          >
            <div className="ReaccionesChat__emoji_reaccion">
              {obtenerEmoji(reaccion.reaction_emoji)}
            </div>
            <div className="ReaccionesChat__texto_reaccion">
              {reaccion.reaction_text}
            </div>
            <div
              className="ReaccionesChat__fecha_reaccion"
              title={format(parseISO(reaccion.created_at), `d 'de' MMMM 'de' yyyy 'a las' HH:mm`, { locale: es })}
            >
              {formatDistanceToNow(parseISO(reaccion.created_at), { locale: es, addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReaccionesChat