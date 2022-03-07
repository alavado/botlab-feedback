import React, { useState } from 'react'
import './Login.css'
import { useDispatch } from 'react-redux'
import { guardaToken } from '../../redux/ducks/login'
import { guardaTiposEncuestas } from '../../redux/ducks/encuestas'
import { login as loginAPI } from '../../api/endpoints'
import { format } from 'date-fns'
import classNames from 'classnames'
import logo from '../../assets/images/logo-feedback.svg'
import Loader from '../Loader'
import { InlineIcon } from '@iconify/react'
import iconoError from '@iconify/icons-mdi/warning'

const Login = () => {

  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState()
  const [cargando, setCargando] = useState()
  const dispatch = useDispatch()

  const cambiarVariable = variable => e => {
    setAuth({ ...auth, [variable]: e.target.value })
  }

  const login = async e => {
    e.preventDefault()
    try {
      setCargando(true)
      const { data } = await loginAPI(auth.username, auth.password)
      dispatch(guardaToken({ ...data, cuenta: auth.username }))
      dispatch(guardaTiposEncuestas(data))
    } catch (e) {
      setCargando(false)
      if (e.response?.status === 401) {
        setError('Usuario o contraseña incorrectos.')
      }
      else {
        setError('Servicio no disponible en estos momentos. Por favor, intenta de nuevo en unos minutos.')
      }
    }
  }

  return (
    <div className={classNames({
      'Login': true,
      'Login--cargando': cargando
    })}>
      <div className="Login__contenedor_logo">
        <img className="Login__logo" src={logo} alt="Logo Botlab Feedback" />
      </div>
      <form className="Login__form" onSubmit={login}>
        <h1 className="Login__instruccion">Inicia sesión en tu cuenta</h1>
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
            autoComplete="username"
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
        {error && (
          <p className="Login__error">
            <InlineIcon className="Login__icono_error" icon={iconoError} />
            {error}
          </p>
        )}
        <button
          className="Login__boton"
          type="submit"
          disabled={cargando}
        >
          {cargando ? <Loader /> : 'Ingresar'}
        </button>
      </form>
      <footer className="Login__footer">
        © Cero {format(Date.now(), 'yyyy')}
      </footer>
    </div>
  )
}

export default Login
