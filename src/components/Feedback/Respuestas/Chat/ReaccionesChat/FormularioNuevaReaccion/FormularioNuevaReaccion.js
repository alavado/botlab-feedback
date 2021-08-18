import { useEffect, useRef, useState } from 'react'
import { InlineIcon } from '@iconify/react'
import iconoConfirmar from '@iconify/icons-mdi/check'
import iconoCancelar from '@iconify/icons-mdi/cancel'
import './FormularioNuevaReaccion.css'

const FormularioNuevaReaccion = ({ agregarNota, visible, ocultar }) => {
  
  const [emoji, setEmoji] = useState('✅')
  const [comentario, setComentario] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="FormularioNuevaReaccion">
      <div className="FormularioNuevaReaccion__emoji_reaccion">
        <button
          className="FormularioNuevaReaccion__boton_emoji"
          title="Cambiar emoji"
          onClick={e => e.preventDefault()}
        >
          {emoji}
        </button>
      </div>
      <div className="FormularioNuevaReaccion__texto_reaccion">
        <form onSubmit={agregarNota(emoji, comentario)}>
          <input
            className="FormularioNuevaReaccion__input_nueva_reaccion"
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            ref={inputRef}
            placeholder="Comentario (opcional)"
            onKeyUp={e => e.stopPropagation()}
            maxLength={100}
          />
        </form>
      </div>
      <div className="FormularioNuevaReaccion__contenedor_botones">
        <button
          onClick={agregarNota}
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