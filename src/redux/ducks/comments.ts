import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { Emoji } from '../../components/Feedback/InteractionDrawer/InteractionComments/InteractionComment/InteractionCommentIcon/emojis'

interface CommentsState {
  suggestions: CommentSuggestion[]
}

interface CommentSuggestion {
  emoji: Emoji
  text: string
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    suggestions: [],
  } as CommentsState,
  reducers: {
    addSuggestion(state, action: PayloadAction<CommentSuggestion>) {
      state.suggestions = _.union(state.suggestions, [action.payload])
    },
    removeSuggestion(state, action: PayloadAction<CommentSuggestion>) {
      state.suggestions = _.difference(state.suggestions, [action.payload])
    },
  },
})

export const { addSuggestion, removeSuggestion } = commentsSlice.actions

export default commentsSlice.reducer
