import React from 'react'
import { useDispatch } from 'react-redux'
import { cierraLaSesion } from '../../../../redux/ducks/login'
import './Logout.css'

const Logout = () => {

  const dispatch = useDispatch()

  return (
    <div className="Logout">
      <button onClick={() => dispatch(cierraLaSesion())}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default Logout
