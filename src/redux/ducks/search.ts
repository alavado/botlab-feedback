import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Interaction } from '../../api/types/servicio'

interface SearchState {
  term: string
  drawerVisible: boolean
  activeInteraction?: Interaction
}

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    term: '',
    drawerVisible: false,
    activeInteraction: undefined,
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
    setActiveInteraction(state, action: PayloadAction<Interaction>) {
      state.activeInteraction = action.payload
    },
  },
})

export const { setTerm, showDrawer, hideDrawer, setActiveInteraction } =
  searchSlice.actions

export default searchSlice.reducer
