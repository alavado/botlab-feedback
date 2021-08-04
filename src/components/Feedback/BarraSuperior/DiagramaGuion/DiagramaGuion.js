import React, { useEffect, useState } from 'react'
import './DiagramaGuion.css'
import { useSelector } from 'react-redux'
import { parsearXMLDeGuion } from '../../../../helpers/guionXML'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import iconoCerrar from '@iconify/icons-mdi/close'

const DiagramaGuion = ({ visible, esconder }) => {

  const { todosLosHeaders, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const [nodos, setNodos] = useState([])
  const [error, setError] = useState()

  useEffect(() => {
    const guion = todosLosHeaders?.find(h => h.poll_id === idEncuestaSeleccionada)?.script
    if (!guion) {
      return
    }
    const guionJSON = parsearXMLDeGuion(guion)
    const primeraPregunta = guionJSON.poll.question.find(q => q.attr['@_id'] === '0')
    setNodos([
      {
        texto: primeraPregunta.message
      }
    ])
  }, [todosLosHeaders, idEncuestaSeleccionada])

  useEffect(() => {
    const ev = document.body.addEventListener('paste', e => {
      const texto = (e.clipboardData || window.clipboardData).getData('text')
      try {
        const guion = parsearXMLDeGuion(texto)
        console.log(guion)
        setError()
      }
      catch (e) {
        setError(e.message)
      }
    })
    return () => document.removeEventListener('paste', ev)
  }, [])

  return (
    <div
      className="DiagramaGuion"
      onClick={esconder}
      style={{ pointerEvents: visible ? 'all': 'none' }}
    >
      <div
        className={classNames({
          'DiagramaGuion__modal': true,
          'DiagramaGuion__modal--visible': visible
        })}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="DiagramaGuion__boton_cerrar_modal"
          onClick={esconder}
          title="Ocultar guión"
        >
          <InlineIcon icon={iconoCerrar} />
        </button>
        {error}
        {nodos.map((nodo, i) => (
          <div key={`nodo-diagrama-guion-${i}`}>
            {nodo.texto}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DiagramaGuion