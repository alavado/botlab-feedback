import React, { useState } from 'react'
import './Login.css'
import { useDispatch } from 'react-redux'
import { guardaToken } from '../../redux/ducks/login'
import { useHistory } from 'react-router-dom'
import { guardaTiposEncuestas } from '../../redux/ducks/encuestas'
import logo from '../../assets/images/logo-feedback.svg'
import { login as loginAPI } from '../../api/endpoints'

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
      const { data } = await loginAPI(auth.username, auth.password)
      dispatch(guardaToken(data))
      dispatch(guardaTiposEncuestas(data))
      setCargando(false)
      history.push('/respuestas')
    } catch (e) {
      setCargando(false)
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="Login">
      <form className="Login__form" onSubmit={login}>
        <div className="Login__contenedor_logo">
          <img className="Login__logo" src={logo} alt="Logo Botlab Feedback" />
        </div>
        <div className="Login__campo">
          <label
            htmlFor="login_usuario"
            className="Login__label"
          >
            Nombre de usuario
          </label>
          <input
            className="Login__input"
            type="text"
            onChange={cambiarVariable('username')}
            id="login_usuario"
            autoFocus
            required
          />
        </div>
        <div className="Login__campo">
          <label
            htmlFor="login_password"
            className="Login__label"
          >
            Contraseña
          </label>
          <input
            className="Login__input"
            type="password"
            onChange={cambiarVariable('password')}
            id="login_password"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          className="Login__boton"
          type="submit"
        >
          Ingresar
        </button>
        {cargando && <p>Ingresando...</p>}
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default Login
