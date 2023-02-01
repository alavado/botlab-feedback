import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

const loginSlice = createSlice({
  name: 'login',
  initialState: {},
  reducers: {
    guardaToken(state, action) {
      const { token, client: nombreUsuario, cuenta, polls } = action.payload
      state.sucursales = _.uniq(_.flatten(polls.map((p) => p.sucursales)))
      state.token = token
      state.fechaToken = Date.now()
      state.nombreUsuario = nombreUsuario
      state.cuenta = cuenta
    },
    cierraLaSesion(state) {
      state.token = undefined
      state.fechaToken = undefined
      state.nombreUsuario = undefined
    },
  },
})

export const { guardaToken, cierraLaSesion } = loginSlice.actions

export default loginSlice.reducer
