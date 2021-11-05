import { useEffect, useState } from 'react'
import { parsearXMLDeGuion } from '../../../helpers/guionXML'
import cytoscape from 'cytoscape'
import './VisorGuiones.css'
import _, { isArray } from 'lodash'

const obtenerColorArista = label => {
  const labelLC = label.toLowerCase()
  if (labelLC.includes('::')) {
    return '#a69fa2'
  }
  if (labelLC.includes('yes') || labelLC.includes('success')) {
    return '#8396c9'
  }
  if (labelLC.includes('reagenda')) {
    return '#a69fa2'
  }
  if (labelLC.includes('out')) {
    return '#a69fa2'
  }
  if (labelLC.includes('no') || labelLC.includes('failure') || labelLC.includes('max_wait')) {
    return '#c59434'
  }
  return '#a69fa2'
}

const VisorGuiones = () => {

  const [error, setError] = useState()
  const [xml, setXml] = useState()
  
  useEffect(() => {
    if (!xml) {
      return
    }
    const vertices = [
      ...xml.poll.question.map(question => ({
        data: {
          id: question.attr['@_id']
        }
      })),
      {
        data: {
          id: '_FINAL_NOT_OK'
        }
      },
      {
        data: {
          id: '_FINAL_OK'
        }
      }
    ]
    console.log(xml)
    const aristas = _.flatten(xml.poll.question.map(question => {
      const cases = [
        ...(isArray(question.answer.case)
            ? question.answer.case
            : [question.answer.case]
          ).filter(c => c.attr['@_next'] !== '_STAY'),
        ...(question.max_wait ? [question.max_wait] : [])
      ]
      return cases.map(c => {
        const label = c.attr['@_option'] || `${c.attr['@_time']}`
        return {
          data: {
            id: `${question.attr['@_id']}${c.attr['@_next']}${label}`,
            source: question.attr['@_id'],
            target: c.attr['@_next'],
            label,
            color: obtenerColorArista(label)
          }
        }
      })
    }))
    console.log(aristas)
    let cy = cytoscape({
      container: document.querySelector('.VisorGuiones__grafo'),
      elements: [
        ...vertices,
        ...aristas
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': `data(id)`
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle-tee',
            'curve-style': 'bezier',
            'label': `data(label)`,
          }
        },
      ],

      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 0,
      }
    })
  }, [xml])

  const parsearXML = e => {
    const texto = (e.clipboardData || window.clipboardData).getData('text')
    setError('')
    try {
      const xml = parsearXMLDeGuion(texto)
      setXml(xml)
    }
    catch (error) {
      setError(error.message)
    }
  }

  return (
    <div
      className="VisorGuiones"
      onPaste={parsearXML}
    >
      <p>Pega el XML de un guion para verlo {error && <span className="VisorGuiones__error">{error}</span>}</p>
      <div className="VisorGuiones__grafo">

      </div>
    </div>
  )
}

export default VisorGuiones