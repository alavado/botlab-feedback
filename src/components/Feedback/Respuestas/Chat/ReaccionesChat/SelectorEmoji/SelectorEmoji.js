import { createPortal } from 'react-dom'
import './SelectorEmoji.css'

const categoriasEmojis = [
  {
    nombre: 'Comunes',
    emojis: ['✅', '❌', '⏳']
  },
  {
    nombre: 'Reacciones',
    emojis: ['😊', '😟']
  }
]

const SelectorEmoji = ({ setEmoji, cerrar }) => {

  const clickEnEmoji = emoji => {
    setEmoji(emoji)
    console.log(emoji)
    cerrar()
  }

  return createPortal(
    <div className="SelectorEmoji">
      {categoriasEmojis.map(({ nombre, emojis }) => (
        <div>
          <h6>{nombre}</h6>
          {emojis.map(emoji => <button onClick={() => clickEnEmoji(emoji)}>{emoji}</button>)}
        </div>
      ))}
    </div>
  , document.getElementById('selector-emojis'))
}

export default SelectorEmoji