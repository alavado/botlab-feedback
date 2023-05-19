import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

interface LoginState {
  sucursales?: string[]
  token?: string
  fechaToken?: Date
  nombreUsuario?: string
  cuenta?: string
  idCliente?: number
}

const loginSlice = createSlice({
  name: 'login',
  initialState: {} as LoginState,
  reducers: {
    guardaToken(state, action) {
      const {
        token,
        client: nombreUsuario,
        cuenta
      } = action.payload
      state.sucursales = []//_.uniq(_.flatten(polls.map((p: any) => p.sucursales)))
      state.token = token
      state.fechaToken = new Date()
      state.nombreUsuario = nombreUsuario
      state.cuenta = cuenta
      state.idCliente = polls[0].client_id
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
