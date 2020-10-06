import React from 'react'
import { useSelector } from 'react-redux'
import './Respuestas.css'

const Respuestas = () => {

  const { token } = useSelector(state => state.login)

  return (
    <div className="Respuestas">
      respuestas
      {token}
    </div>
  )
}

export default Respuestas
