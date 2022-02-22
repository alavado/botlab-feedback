import { useEffect, useRef, useState } from 'react'
import './FormularioNuevaReaccion.css'
import SelectorEmoji from '../SelectorEmoji'
import { useDispatch, useSelector } from 'react-redux'
import { guardaReaccion } from '../../../../../../redux/ducks/reacciones'

const FormularioNuevaReaccion = ({ agregarNota }) => {
  
  const [emoji, setEmoji] = useState('✅')
  const [comentario, setComentario] = useState('')
  const [conteo, setConteo] = useState(0)
  const [seleccionandoEmoji, setSeleccionandoEmoji] = useState(false)
  const { reaccionesGuardadas } = useSelector(state => state.reacciones)
  const inputRef = useRef()
  const botonEmojiRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const agregar = e => {
    e.preventDefault()
    agregarNota(emoji, comentario)
    dispatch(guardaReaccion({ emoji, comentario }))
  }

  return (
    <>
      <div className="FormularioNuevaReaccion">
        {seleccionandoEmoji && (
          <SelectorEmoji
            setEmoji={setEmoji}
            cerrar={() => {
              setSeleccionandoEmoji(false)
              inputRef.current.focus()
            }}
            refPadre={botonEmojiRef}
          />
        )}
        <div className="FormularioNuevaReaccion__emoji_reaccion">
          <button
            className="FormularioNuevaReaccion__boton_emoji"
            title="Cambiar emoji"
            onClick={() => setSeleccionandoEmoji(!seleccionandoEmoji)}
            ref={botonEmojiRef}
          >
            {emoji}
          </button>
        </div>
        <form
          onSubmit={agregar}
          className="FormularioNuevaReaccion__formulario"
        >
          <input
            className="FormularioNuevaReaccion__input_nueva_reaccion"
            value={comentario}
            onChange={e => {
              setComentario(e.target.value)
              setConteo(e.target.value.length)
            }}
            ref={inputRef}
            placeholder="Escribe un comentario..."
            onKeyUp={e => e.stopPropagation()}
            onFocus={() => setSeleccionandoEmoji(false)}
            maxLength={100}
            type="text"
            name="comentarioNuevaReaccion"
            id="comentarioNuevaReaccion"
            autoComplete="on"
          />
          {conteo > 0 &&
            <p
              className="FormularioNuevaReaccion__conteo"
              style={{ color: conteo > 80 ? 'var(--color-secundario)' : 'inherit' }}
            >
              {conteo} / 100
            </p>
          }
          <button
            onClick={agregar}
            className="FormularioNuevaReaccion__boton"
            title="Agregar comentario"
            type="submit"
          >
            {/* <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoConfirmar} /> */}
            <p>Agregar</p>
          </button>
        </form>
      </div>
      <div className="FormularioNuevaReaccion__contenedor_sugerencias">
        Sugerencias: 
        {reaccionesGuardadas.slice(0, 3).map(({ emoji, comentario }) => (
          <span
            className="FormularioNuevaReaccion__boton_sugerencia"
            onClick={() => {
              setEmoji(emoji)
              setComentario(comentario)
            }}
          >
            <span>{emoji}</span>
            <span>{comentario}</span>
          </span>
        ))}
      </div>
    </>
  )
}

export default FormularioNuevaReaccion