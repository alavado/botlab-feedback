import React, { useState } from 'react'
import axios from 'axios'
import './Login.css'
import { useDispatch } from 'react-redux'
import { guardaToken } from '../../redux/ducks/login'
import { useHistory } from 'react-router-dom'
import { guardaTiposEncuestas } from '../../redux/ducks/encuestas'

const Login = () => {

  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState()
  const [cargando, setCargando] = useState()
  const dispatch = useDispatch()
  const history = useHistory()

  const cambiarVariable = variable => e => {
    setAuth({ ...auth, [variable]: e.target.value })
  }

  const login = async e => {
    e.preventDefault()
    try {
      setCargando(true)
      const { data } = await axios.get('https://api.dev.botlab.cl/token', { auth })
      dispatch(guardaToken(data))
      dispatch(guardaTiposEncuestas(data))
      history.push('/respuestas')
    } catch (e) {
      setError('Usuario o contraseña incorrectos')
    }
    setCargando(false)
  }

  return (
    <div>
      <h1>Botlab Feedback</h1>
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
        {cargando && <p>Ingresando...</p>}
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default Login
