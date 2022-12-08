import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  term: string
}

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    term: '',
  } as SearchState,
  reducers: {
    setTerm(state, action: PayloadAction<string>) {
      state.term = action.payload
    },
  }
})

export const {
  setTerm,
} = searchSlice.actions

export default searchSlice.reducer