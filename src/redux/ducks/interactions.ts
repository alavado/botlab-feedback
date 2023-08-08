import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addWeeks, endOfWeek, startOfWeek } from 'date-fns'

export type Range = {
  start: Date
  end: Date
}

type RangeWord = 'TODAY' | 'THIS_WEEK' | 'LAST_WEEK'
interface InteractionsState {
  range: Range
}

const getRangeFromWord = (word: RangeWord): Range => {
  switch (word) {
    case 'TODAY':
      return {
        start: new Date(),
        end: new Date(),
      }
    case 'THIS_WEEK':
      return {
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: new Date(),
      }
    case 'LAST_WEEK':
      const lastWeek = addWeeks(new Date(), -1)
      return {
        start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      }
    default:
      throw Error('Rango de fechas inválido')
  }
}

const interactionsSlice = createSlice({
  name: 'Interactions',
  initialState: {
    range: getRangeFromWord('TODAY'),
  } as InteractionsState,
  reducers: {
    setRange(state, action: PayloadAction<Range>) {
      state.range = action.payload
    },
    setRangeFromWord(state, action: PayloadAction<RangeWord>) {
      state.range = getRangeFromWord(action.payload)
    },
  },
})

export const { setRange } = interactionsSlice.actions

export default interactionsSlice.reducer
