import { createSlice } from '@reduxjs/toolkit'

interface InteractionsState {}

const interactionsSlice = createSlice({
  name: 'Interactions',
  initialState: {} as InteractionsState,
  reducers: {},
})

export default interactionsSlice.reducer
