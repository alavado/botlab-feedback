import { InlineIcon } from '@iconify/react'
import iconoAgregar from '@iconify/icons-mdi/sticky-note-add'
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
  const [formularioActivo, setFormularioActivo] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const dispatch = useDispatch()

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
        dispatch(agregaReaccionARespuesta({ idUsuario, emoji, comentario }))
        setFormularioActivo(false)
        setRefresh(true)
      })
  }

  reacciones?.sort((r1, r2) => r1.created_at > r2.created_at ? -1 : 1)

  return (
    <div className="ReaccionesChat">
      <div className="ReaccionesChat__superior">
        <h2 className="ReaccionesChat__titulo">Notas</h2>
        {!formularioActivo && reacciones?.length > 0 && (
          <button
            className="ReaccionesChat__boton"
            onClick={() => setFormularioActivo(true)}
            title="Agregar nueva nota a este chat"
          >
            <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoAgregar} /> Agregar nota
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
                    title="Agregar nueva nota a este chat"
                  >
                    <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoAgregar} /> Agregar nota
                  </button>
                  <p className="ReaccionesChat__mensaje_sin_notas">No hay notas para este chat</p>
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