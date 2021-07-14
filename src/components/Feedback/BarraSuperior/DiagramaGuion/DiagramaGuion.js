import React, { useMemo } from 'react'
import './DiagramaGuion.css'
import { parse } from 'fast-xml-parser'
import { useSelector } from 'react-redux'

const DiagramaGuion = ({ visible, esconder }) => {

  const { todosLosHeaders, idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  const nodos = useMemo(() => {  
    if (!todosLosHeaders || !idEncuestaSeleccionada) {
      return []
    }
    const guion = todosLosHeaders.find(h => h.poll_id === idEncuestaSeleccionada).script
    const guionJSON = parse(
      guion,
      {
        attrNodeName: 'attr',
        attributeNamePrefix : "@_",
        ignoreAttributes: false
      }
    )
    const primeraPregunta = guionJSON.poll.question.find(q => q.attr['@_id'] === '0')
    return [
      {
        texto: primeraPregunta.message
      }
    ]
  }, [todosLosHeaders, idEncuestaSeleccionada])

  return (
    <div className="DiagramaGuion">
      <div
        className="BarraSuperior__modal"
        style={{ display: visible ? 'flex': 'none' }}
        onClick={esconder}
      >
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