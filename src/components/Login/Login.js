import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'

const Login = () => {

  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })

  const cambiarVariable = variable => e => {
    setAuth({ ...auth, [variable]: e.target.value })
  }

  const login = async e => {
    e.preventDefault()
    const { data: { token } } = await axios.get('https://api.dev.botlab.cl/token', { auth })
    console.log(token)
  }

  return (
    <div>
      <form onSubmit={login}>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            onChange={cambiarVariable('username')}
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
