import { useEffect, useRef, useState } from 'react'
import { InlineIcon } from '@iconify/react'
import iconoConfirmar from '@iconify/icons-mdi/check'
import iconoCancelar from '@iconify/icons-mdi/cancel'
import './FormularioNuevaReaccion.css'
import SelectorEmoji from '../SelectorEmoji'

const FormularioNuevaReaccion = ({ agregarNota, ocultar }) => {
  
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
      <div className="FormularioNuevaReaccion__texto_reaccion">
        <form onSubmit={agregar} className="FormularioNuevaReaccion__formulario">
          <input
            className="FormularioNuevaReaccion__input_nueva_reaccion"
            value={comentario}
            onChange={e => {
              setComentario(e.target.value)
              setConteo(e.target.value.length)
            }}
            ref={inputRef}
            placeholder="Comentario (opcional)"
            onKeyUp={e => e.stopPropagation()}
            onFocus={() => setSeleccionandoEmoji(false)}
            maxLength={100}
          />
          {conteo > 0 && (
            <p
              className="FormularioNuevaReaccion__conteo"
              style={{ color: conteo > 80 ? 'var(--color-secundario)' : 'inherit' }}
            >
              {conteo} / 100
            </p>)}
        </form>
      </div>
      <div className="FormularioNuevaReaccion__contenedor_botones">
        <button
          onClick={agregar}
          className="FormularioNuevaReaccion__boton"
          title="Agregar nota"
        >
          <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoConfirmar} /> <p>Agregar</p>
        </button>
        <button
          type="button"
          className="FormularioNuevaReaccion__boton"
          onClick={e => {
            e.preventDefault()
            ocultar()
          }}
          title="Cancelar"
        >
          <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoCancelar} /> <p>Cancelar</p>
        </button>
      </div>
    </div>
  )
}

export default FormularioNuevaReaccion