import { useRef, useState } from 'react'
import './FormularioNuevaReaccion.css'
import iconoEliminar from '@iconify/icons-mdi/close'
import SelectorEmoji from '../SelectorEmoji'
import { useDispatch, useSelector } from 'react-redux'
import { eliminaReaccion, guardaReaccion } from '../../../../../../redux/ducks/reacciones'
import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'

const FormularioNuevaReaccion = ({ agregarNota }) => {
  
  const [emoji, setEmoji] = useState('✅')
  const [comentario, setComentario] = useState('')
  const [conteo, setConteo] = useState(0)
  const [seleccionandoEmoji, setSeleccionandoEmoji] = useState(false)
  const [editando, setEditando] = useState(false)
  const { reaccionesGuardadas } = useSelector(state => state.reacciones)
  const inputRef = useRef()
  const botonEmojiRef = useRef()
  const dispatch = useDispatch()

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
            className={classNames({
              "FormularioNuevaReaccion__boton_emoji": true,
              "FormularioNuevaReaccion__boton_emoji--visible": editando,
            })}
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
            onFocus={() => {
              setSeleccionandoEmoji(false)
              setEditando(true)
            }}
            onBlur={() => {
              if (!comentario) {
                setEditando(false)
              }
            }}
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
            className={classNames({
              "FormularioNuevaReaccion__boton": true,
              "FormularioNuevaReaccion__boton--visible": editando,
            })}
            title="Agregar comentario"
            type="submit"
          >
            {/* <InlineIcon style={{ fontSize: '.8rem' }} icon={iconoConfirmar} /> */}
            <p>Agregar</p>
          </button>
        </form>
      </div>
      {reaccionesGuardadas?.length > 0 &&
        <div className={classNames({
          "FormularioNuevaReaccion__contenedor_sugerencias": true,
          "FormularioNuevaReaccion__contenedor_sugerencias--visible": editando
        })}>
          Sugerencias: 
          {reaccionesGuardadas.slice(0, 5).map(({ emoji, comentario }, i) => (
            <span
              className="FormularioNuevaReaccion__boton_sugerencia"
              onClick={() => {
                setEmoji(emoji)
                setComentario(comentario)
                inputRef.current.focus()
              }}
              title={comentario}
              key={`fila-comentario-${i}`}
            >
              <span>{emoji}</span>
              <span className="FormularioNuevaReaccion__boton_sugerencia_comentario">{comentario}</span>
              <button
                onClick={e => {
                  e.stopPropagation()
                  dispatch(eliminaReaccion(comentario))
                }}
                className="FormularioNuevaReaccion__boton_eliminar_sugerencia"
                title="Eliminar sugerencia"
              >
                <InlineIcon icon={iconoEliminar} />
              </button>
            </span>
          ))}
        </div>
      }
    </>
  )
}

export default FormularioNuevaReaccion