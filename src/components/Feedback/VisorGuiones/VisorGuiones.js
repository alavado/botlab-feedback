import { useEffect, useState } from 'react'
import { parsearXMLDeGuion } from '../../../helpers/guionXML'
import cytoscape from 'cytoscape'
import './VisorGuiones.css'
import _, { isArray } from 'lodash'

const obtenerColorArista = label => {
  const labelLC = label.toLowerCase()
  if (labelLC.includes('::')) {
    return '#837171'
  }
  if (labelLC.includes('yes') || labelLC.includes('succ')) {
    return '#3994fc'
  }
  if (labelLC.includes('reagenda')) {
    return '#0079ce'
  }
  if (labelLC.includes('out')) {
    return '#bb8b00'
  }
  if (labelLC.includes('no') || labelLC.includes('fail') || labelLC.includes('max_wait')) {
    return '#bb8b00'
  }
  if (labelLC.endsWith('m') || labelLC.endsWith('h')) {
    return '#555'
  }
  return '#837171'
}

const borderWidthVerticesInternos = 1
const borderWidthVerticesExternos = 4

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
          id: question.attr['@_id'],
          borderWidth: question.attr['@_id'] === '0' ? borderWidthVerticesExternos : borderWidthVerticesInternos,
          backgroundColor: question.attr['@_type'] === 'INTERNAL' ? '#ccc' : 'white',
          texto: `${question.attr['@_id']}`,
        }
      })),
      {
        data: {
          id: '_FINAL_NOT_OK',
          borderWidth: borderWidthVerticesExternos,
          backgroundColor: '#ccc',
          texto: `_FINAL_NOT_OK`,
        }
      },
      {
        data: {
          id: '_FINAL_OK',
          borderWidth: borderWidthVerticesExternos,
          backgroundColor: '#ccc',
          texto: `_FINAL_OK`,
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
        let label = c.attr['@_option'] || `${c.attr['@_time']}`
        label = label.replace('action_result:', '')
        label = label.replace('::gt::', '>')
        label = label.replace('::ge::', '≥')
        label = label.replace('::lt::', '<')
        label = label.replace('::le::', '≤')
        label = label.replace('::eq::', '=')
        label = label.replace('::ne::', '≠')
        return {
          data: {
            id: `${question.attr['@_id']}${c.attr['@_next']}${label}`,
            source: question.attr['@_id'],
            target: c.attr['@_next'],
            label: `${label}`,
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
            'background-color': 'data(backgroundColor)',
            'label': `data(texto)`,
            'border-width': 'data(borderWidth)',
            'border-color': '#333',
            "text-background-color": '#fff',
            "text-margin-y": '-3px',
            'text-background-opacity': 1,
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
            'color': 'white',
            "text-background-color": 'data(color)',
            'text-background-opacity': 1,
            "text-background-padding": 3
          }
        },
      ],

      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 20,
        avoidOverlap: true,
      },
      
      wheelSensitivity: 0.1
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
      <div className="VisorGuiones__contenedor">
        <div className="VisorGuiones__celular">
          <p>Pega el XML de un guion para verlo {error && <span className="VisorGuiones__error">{error}</span>}</p>
          Aquí tengo que hacer un celular interactivo
        </div>
        <div className="VisorGuiones__grafo">
          <div className="VisorGuiones__leyenda_grafo">
            Leyenda del grafo
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisorGuiones