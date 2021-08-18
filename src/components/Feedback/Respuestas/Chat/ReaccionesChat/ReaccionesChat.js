import { InlineIcon } from '@iconify/react'
import { format, parseISO } from 'date-fns'
import { formatDistanceToNow } from 'date-fns/esm'
import { es } from 'date-fns/locale'
import iconoAgregar from '@iconify/icons-mdi/add-box'
import iconoEliminar from '@iconify/icons-mdi/delete'
import { useEffect, useState } from 'react'
import { agregarReaccion, eliminarReaccion, obtenerReacciones } from '../../../../../api/endpoints'
import { useParams } from 'react-router-dom'
import './ReaccionesChat.css'
import LoaderChat from '../LoaderChat'
import FormularioNuevaReaccion from './FormularioNuevaReaccion'

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
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      obtenerReacciones(idEncuesta, idUsuario, start)
        .then(({ data })=> {
          setReacciones(data.data)
          setFormularioActivo(false)
        })
    }
  }, [refresh])

  useEffect(() => {
    setReacciones(undefined)
    setFormularioActivo(false)
    if (idEncuesta && idUsuario && start) {
      obtenerReacciones(idEncuesta, idUsuario, start)
        .then(({ data })=> {
          setReacciones(data.data)
        })
    }
  }, [idEncuesta, idUsuario, start])

  const agregarNota = (emoji, comentario) => e => {
    e.preventDefault()
    setReacciones(undefined)
    agregarReaccion(idEncuesta, idUsuario, start, emoji, comentario)
      .then(() => {
        setFormularioActivo(false)
        setRefresh(true)
      })
  }

  const eliminarNota = id => {
    eliminarReaccion(idEncuesta, idUsuario, id)
      .then(() => {
        setRefresh(true)
      })
  }

  reacciones?.sort((r1, r2) => r1.created_at > r2.created_at ? -1 : 1)

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
      {reacciones
        ? <div className="ReaccionesChat__contenedor_lista">
            {formularioActivo && (
              <FormularioNuevaReaccion
                agregarNota={agregarNota}
                visible={formularioActivo}
                ocultar={() => setFormularioActivo(false)}
              />
            )}
            {reacciones.length === 0 && !formularioActivo
              ? <div className="ReaccionesChat__fila_reaccion">
                  <p className="ReaccionesChat__mensaje_sin_notas">Aún no hay notas para este chat</p>
                </div>
              : reacciones.map((reaccion, i) => (
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
                    agregada {formatDistanceToNow(parseISO(reaccion.created_at), { locale: es, addSuffix: true, includeSeconds: false })}
                  </div>
                  <div className="ReaccionesChat__acciones">
                    <button
                      className="ReaccionesChat__boton_eliminar"
                      title="Eliminar esta nota"
                      onClick={() => eliminarNota(reaccion.id)}
                    >
                      <InlineIcon icon={iconoEliminar} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
        : <LoaderChat />
      }
    </div>
  )
}

export default ReaccionesChat