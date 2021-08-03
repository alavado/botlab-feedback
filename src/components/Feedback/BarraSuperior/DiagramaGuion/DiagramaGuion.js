import React, { useEffect, useState } from 'react'
import './DiagramaGuion.css'
import { useSelector } from 'react-redux'
import { parsearXMLDeGuion } from '../../../../helpers/guionXML'

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
        setError()
      }
      catch (e) {
        setError(e.message)
      }
    })
    return () => document.removeEventListener('paste', ev)
  }, [])

  return (
    <div className="DiagramaGuion">
      <div
        className="BarraSuperior__modal"
        style={{ display: visible ? 'flex': 'none' }}
        onClick={esconder}
      >
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