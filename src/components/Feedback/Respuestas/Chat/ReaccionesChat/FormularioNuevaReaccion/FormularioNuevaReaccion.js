import { useEffect, useRef, useState } from 'react'
import './FormularioNuevaReaccion.css'
import SelectorEmoji from '../SelectorEmoji'

const sugerencias = [
  {
    emoji: '✅',
    texto: 'ya contactamos a paciente'
  },
  {
    emoji: '⏳',
    texto: 'paciente no contesta'
  },
  {
    emoji: '📱',
    texto: 'hora reagendada por teléfono'
  }
]

const FormularioNuevaReaccion = ({ agregarNota }) => {
  
  const [emoji, setEmoji] = useState('✅')
  const [comentario, setComentario] = useState('')
  const [conteo, setConteo] = useState(0)
  const [seleccionandoEmoji, setSeleccionandoEmoji] = useState(false)
  const inputRef = useRef()
  const botonEmojiRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const agregar = agregarNota(emoji, comentario)

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
        {sugerencias.map(({ emoji, texto }) => (
          <span
            className="FormularioNuevaReaccion__boton_sugerencia"
            onClick={() => {
              setEmoji(emoji)
              setComentario(texto)
            }}
          >
            <span>{emoji}</span>
            <span>{texto}</span>
          </span>
        ))}
      </div>
    </>
  )
}

export default FormularioNuevaReaccion