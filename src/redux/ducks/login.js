const guardarToken = 'login/guardarToken'

export default function(state = {}, action) {
  switch (action.type) {
    case guardarToken: {
      return {
        ...state,
        token: action.payload
      }
    }
    default: return state
  }
}

export const guardaToken = jsonLogin => ({
  type: guardarToken,
  payload: jsonLogin.token
})