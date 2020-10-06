import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'
import { useDispatch } from 'react-redux'
import { guardaToken } from '../../redux/ducks/login'
import { useHistory } from 'react-router-dom'

const Login = () => {

  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })
  const dispatch = useDispatch()
  const history = useHistory()

  const cambiarVariable = variable => e => {
    setAuth({ ...auth, [variable]: e.target.value })
  }

  const login = async e => {
    e.preventDefault()
    const { data: { token } } = await axios.get('https://api.dev.botlab.cl/token', { auth })
    dispatch(guardaToken(token))
    history.push('/respuestas')
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
