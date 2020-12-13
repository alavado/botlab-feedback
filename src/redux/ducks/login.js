const guardarToken = 'login/guardarToken'
const logout = 'login/logout'

const reducer = (state = {}, action) => {
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

export default reducer

export const guardaToken = jsonLogin => ({
  type: guardarToken,
  payload: jsonLogin
})

export const cierraLaSesion = () => ({
  type: logout
})