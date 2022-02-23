import { InlineIcon } from '@iconify/react'
import iconoAgregar from '@iconify/icons-mdi/lead-pencil'
import { useEffect, useState } from 'react'
import { agregarReaccion, obtenerReacciones } from '../../../../../api/endpoints'
import { useParams } from 'react-router-dom'
import './ReaccionesChat.css'
import LoaderChat from '../LoaderChat'
import FormularioNuevaReaccion from './FormularioNuevaReaccion'
import FilaReaccion from './FilaReaccion'
import { useDispatch } from 'react-redux'
import { agregaReaccionARespuesta } from '../../../../../redux/ducks/respuestas'

const ReaccionesChat = ({ start }) => {

  const { idEncuesta, idUsuario } = useParams()
  const [reacciones, setReacciones] = useState()
  const [formularioActivo, setFormularioActivo] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
      obtenerReacciones(idEncuesta, idUsuario, start)
        .then(({ data })=> {
          setReacciones(data.data)
        })
    }
  }, [refresh, idEncuesta, idUsuario, start])

  useEffect(() => {
    setReacciones(undefined)
    if (idEncuesta && idUsuario && start) {
      obtenerReacciones(idEncuesta, idUsuario, start)
        .then(({ data })=> {
          setReacciones(data.data)
        })
    }
  }, [idEncuesta, idUsuario, start])

  const agregarNota = (emoji, comentario) => {
    setReacciones(undefined)
    agregarReaccion(idEncuesta, idUsuario, start, emoji, comentario)
      .then(() => {
        dispatch(agregaReaccionARespuesta({ idUsuario, emoji, comentario }))
        setFormularioActivo(false)
        setRefresh(true)
      })
    .catch(() => {
      setFormularioActivo(false)
      setRefresh(true)
    })
  }

  reacciones?.sort((r1, r2) => r1.created_at > r2.created_at ? -1 : 1)

  return (
    <div className="ReaccionesChat">
      <div className="ReaccionesChat__superior">
        <h2 className="ReaccionesChat__titulo">Comentarios</h2>
        {!formularioActivo && reacciones?.length > 0 && (
          <button
            className="ReaccionesChat__boton"
            onClick={() => setFormularioActivo(true)}
            title="Agregar un comentario a este chat"
          >
            <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoAgregar} /> Agregar comentario
          </button>
        )}
      </div>
      {reacciones
        ? <div className="ReaccionesChat__contenedor_lista">
            {formularioActivo && (
              <FormularioNuevaReaccion
                agregarNota={agregarNota}
                ocultar={() => setFormularioActivo(false)}
              />
            )}
            {reacciones.length === 0 && !formularioActivo
              ? <div className="ReaccionesChat__contenedor_mensaje_sin_reacciones">
                  <button
                    className="ReaccionesChat__boton"
                    onClick={() => setFormularioActivo(true)}
                    title="Agregar comentario a este chat"
                  >
                    <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoAgregar} /> Agregar comentario
                  </button>
                  <p className="ReaccionesChat__mensaje_sin_notas">Este chat aún no tiene comentarios</p>
                </div>
              : reacciones.map((reaccion, i) => (
                  <FilaReaccion
                    key={`reaccion-chat-${reaccion.id}`}
                    reaccion={reaccion}
                    refrescar={() => setRefresh(true)}
                  />
                ))
            }
          </div>
        : <LoaderChat />
      }
    </div>
  )
}

export default ReaccionesChat