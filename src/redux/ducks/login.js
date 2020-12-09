const guardarToken = 'login/guardarToken'
const logout = 'login/logout'

export default function(state = {}, action) {
  switch (action.type) {
    case guardarToken: {
      const { token, client: nombreUsuario } = action.payload
      return {
        ...state,
        token,
        fechaToken: Date.now(),
        nombreUsuario
      }
    }
    case logout: {
      return {
        ...state,
        token: undefined,
        fechaToken: undefined
      }
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