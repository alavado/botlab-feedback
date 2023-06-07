import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ServiceId } from '../../api/types/domain'

interface AnswersState {
  activeServiceId: ServiceId | undefined
}

const AnswersSlice = createSlice({
  name: 'Answers',
  initialState: {
    activeServiceId: undefined,
  } as AnswersState,
  reducers: {
    selectService(state, action: PayloadAction<ServiceId>) {
      state.activeServiceId = action.payload
    },
  },
})

export const { selectService } = AnswersSlice.actions

export default AnswersSlice.reducer
