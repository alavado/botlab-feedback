import store from '../store'

const guardarToken = 'login/guardarToken'
const logout = 'login/logout'

export default function(state = {}, action) {
  switch (action.type) {
    case guardarToken: {
      const { token, client: nombreUsuario } = action.payload
      return {
        ...state,
        token,
        nombreUsuario
      }
    }
    case logout: {
      window.location.reload()
      return {}
    }
    default: return state
  }
}

export const guardaToken = jsonLogin => ({
  type: guardarToken,
  payload: jsonLogin
})

export const cierraLaSesion = () => ({
  type: logout
})