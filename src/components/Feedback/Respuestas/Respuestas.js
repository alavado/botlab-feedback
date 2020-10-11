import React from 'react'
import TablaRespuestas from './TablaRespuestas'
import SelectorRangoFechas from './SelectorRangoFechas'
import './Respuestas.css'
import { useSelector } from 'react-redux'

const Respuestas = () => {

  const { headers } = useSelector(state => state.encuestas)

  return (
    <div className="Respuestas">
      <h1 className="Respuestas__titulo">Respuestas</h1>
      <SelectorRangoFechas />
      {headers && <TablaRespuestas />}
    </div>
  )
}

export default Respuestas
