import React from 'react'
import { useSelector } from 'react-redux'
import './TablaRespuestas.css'

const TablaRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)

  return (
    <div className="TablaRespuestas">
      <div className="TablaRespuestas__headers">
        {headers.map(({ nombre, texto }) => (
          <div
            key={`header-${nombre}`}
            className="TablaRespuestas__celda"
          >
            {texto}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TablaRespuestas
