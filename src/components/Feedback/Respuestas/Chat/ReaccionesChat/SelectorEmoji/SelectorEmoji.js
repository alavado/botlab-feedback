import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './SelectorEmoji.css'

const categoriasEmojis = [
  {
    nombre: 'Reacciones',
    emojis: ['😊', '😟', '🤔', '😴', '😨']
  },
  {
    nombre: 'Símbolos',
    emojis: ['✅', '❌', '⌛', '👀', '💜']
  },
  {
    nombre: 'Colores',
    emojis: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪']
  }
]

const SelectorEmoji = ({ setEmoji, cerrar, refPadre }) => {

  const refContenedor = useRef()
  const [pos, setPos] = useState({ left: 0, top: 0, opacity: 0 })

  const clickEnEmoji = emoji => {
    setEmoji(emoji)
    cerrar()
  }

  useEffect(() => {
    setPos({
      left: refPadre.current?.getBoundingClientRect().left - refContenedor.current.getBoundingClientRect().width / 2 + refPadre.current.getBoundingClientRect().width / 2,
      top: refPadre.current?.getBoundingClientRect().top - refContenedor.current.getBoundingClientRect().height,
      opacity: 1
    })
  }, [])

  return createPortal(
    <div
      className="SelectorEmoji"
      style={pos}
      ref={refContenedor}
    >
      <div className="SelectorEmoji__contenedor">
        {categoriasEmojis.map(({ nombre, emojis }) => (
          <div
            className="SelectorEmoji__contenedor_categoria"
            key={`contenedor-emojis-${nombre}`}
          >
            <h6 className="SelectorEmoji__titulo_categoria_emojis">{nombre}</h6>
            <div className="SelectorEmoji__contenedor_botones">
              {emojis.map(emoji => (
                <button
                  key={`boton-${emoji}`}
                  onClick={() => clickEnEmoji(emoji)}
                  className="SelectorEmoji__boton_emoji"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  , document.getElementById('selector-emojis'))
}

export default SelectorEmoji