import { InlineIcon } from '@iconify/react'
import { format, parseISO } from 'date-fns'
import { formatDistanceToNow } from 'date-fns/esm'
import { es } from 'date-fns/locale'
import iconoAgregar from '@iconify/icons-mdi/add-box'
import iconoConfirmar from '@iconify/icons-mdi/check'
import iconoCancelar from '@iconify/icons-mdi/cancel'
import iconoEliminar from '@iconify/icons-mdi/delete'
import { useEffect, useRef, useState } from 'react'
import { agregarReaccion, obtenerReacciones } from '../../../../../api/endpoints'
import { useParams } from 'react-router-dom'
import './ReaccionesChat.css'
import LoaderChat from '../LoaderChat'

const obtenerEmoji = texto => {
  switch (texto) {
    case ':smile:': return '😊'
    case ':sad:': return '😢'
    default: return texto
  }
}

const ReaccionesChat = ({ start }) => {

  const { idEncuesta, idUsuario } = useParams()
  const [reacciones, setReacciones] = useState()
  const [formularioActivo, setFormularioActivo] = useState(false)
  const [comentario, setComentario] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [emoji, setEmoji] = useState('✅')
  const inputRef = useRef()

  useEffect(() => {
    if (idEncuesta && idUsuario && start) {
      setReacciones(undefined)
      setComentario('')
      setFormularioActivo(false)
      obtenerReacciones(idEncuesta, idUsuario, start)
        .then(({ data })=> {
          setReacciones(data.data)
        })
    }
    if (refresh) {
      setComentario('')
      obtenerReacciones(idEncuesta, idUsuario, start)
        .then(({ data })=> {
          setReacciones(data.data)
        })
    }
    setRefresh(false)
  }, [idEncuesta, idUsuario, start, refresh])

  useEffect(() => {
    if (formularioActivo) {
      inputRef.current?.focus()
    }
  }, [formularioActivo])

  const agregarComentario = e => {
    e.preventDefault()
    agregarReaccion(idEncuesta, idUsuario, start, emoji, comentario)
      .then(() => {
        setFormularioActivo(false)
        setComentario('')
        setRefresh(true)
      })
  }

  if (!reacciones) {
    return <LoaderChat />
  }

  reacciones.sort((r1, r2) => r1.created_at > r2.created_at ? -1 : 1)

  return (
    <div className="ReaccionesChat">
      <div className="ReaccionesChat__superior">
        <h2 className="ReaccionesChat__titulo">Notas</h2>
        {!formularioActivo &&
          <button
            className="ReaccionesChat__boton"
            onClick={() => setFormularioActivo(true)}
            title="Agregar nueva nota a este chat"
          >
            <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoAgregar} /> Agregar
          </button>
        }
      </div>
      <div className="ReaccionesChat__contenedor_lista">
        {formularioActivo &&
          <div
            className="ReaccionesChat__fila_reaccion ReaccionesChat__fila_reaccion--formulario"
          >
            <div className="ReaccionesChat__emoji_reaccion">
              <button
                className="ReaccionesChat__boton_emoji"
                title="Cambiar emoji"
                onClick={e => e.preventDefault()}
              >
                {emoji}
              </button>
            </div>
            <div className="ReaccionesChat__texto_reaccion">
              <form onSubmit={agregarComentario}>
                <input
                  className="ReaccionesChat__input_nueva_reaccion"
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  ref={inputRef}
                  placeholder="Comentario (opcional)"
                  maxLength={100}
                />
              </form>
            </div>
            <div className="ReaccionesChat__contenedor_botones">
              <button
                onClick={agregarComentario}
                className="ReaccionesChat__boton"
                title="Agregar nota"
              >
                <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoConfirmar} /> <p>Agregar</p>
              </button>
              <button
                type="button"
                className="ReaccionesChat__boton"
                onClick={e => {
                  e.preventDefault()
                  setFormularioActivo(false)
                }}
                title="Cancelar"
              >
                <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoCancelar} /> <p>Cancelar</p>
              </button>
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
              Agregada {formatDistanceToNow(parseISO(reaccion.created_at), { locale: es, addSuffix: true, includeSeconds: false })}
            </div>
            <div className="ReaccionesChat__acciones">
              <button
                className="ReaccionesChat__boton_eliminar"
                title="Eliminar esta nota"
              >
                <InlineIcon icon={iconoEliminar} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReaccionesChat