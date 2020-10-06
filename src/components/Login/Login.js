import React, { useState } from 'react'
import './Login.css'

const Login = () => {

  const [variables, setVariables] = useState({
    usuario: '',
    password: ''
  })

  const cambiarVariable = variable => e => {
    setVariables({ ...variables, [variable]: e.target.value })
  }

  const login = e => {
    e.preventDefault()
    console.log(variables)
  }

  return (
    <div>
      <form onSubmit={login}>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            onChange={cambiarVariable('usuario')}
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            onChange={cambiarVariable('password')}
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}

export default Login
