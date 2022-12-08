import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  term: string,
  drawerVisible: boolean,
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
    showDrawer(state) {
      state.drawerVisible = true
    },
    hideDrawer(state) {
      state.drawerVisible = false
    },
  }
})

export const {
  setTerm,
  showDrawer,
  hideDrawer,
} = searchSlice.actions

export default searchSlice.reducer