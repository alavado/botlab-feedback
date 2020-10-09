const guardarToken = 'login/guardarToken'
const logout = 'login/logout'

export default function(state = {}, action) {
  switch (action.type) {
    case guardarToken: {
      return {
        ...state,
        token: action.payload
      }
    }
    case logout: {
      return {
        ...state,
        token: undefined
      }
    }
    default: return state
  }
}

export const guardaToken = jsonLogin => ({
  type: guardarToken,
  payload: jsonLogin.token
})

export const cierraLaSesion = () => ({
  type: logout
})