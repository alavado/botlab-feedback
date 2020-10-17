import React from 'react'
import './Loader.css'

const Loader = ({ color }) => {
  return (
    <div className="Loader" style={{ borderLeftColor: color ?? 'white' }} />
  )
}

export default Loader
