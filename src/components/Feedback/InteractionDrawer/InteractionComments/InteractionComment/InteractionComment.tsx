import { format, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { Comment } from '../../../../../api/types/types'
import './InteractionComment.css'
import InteractionCommentIcon from './InteractionCommentIcon'
import { Emoji } from './InteractionCommentIcon/emojis'

const InteractionComment = ({ comment }: { comment: Comment }) => {
  return (
    <div className="InteractionComment">
      <div className="InteractionComment__icon">
        <InteractionCommentIcon emoji={comment.emoji as Emoji} />
      </div>
      <div className="InteractionComment__time">
        {format(comment.timestamp, 'HH:mm')}
        {!isToday(comment.timestamp) && (
          <div className="InteractionComment__day">
            {isYesterday(comment.timestamp)
              ? 'ayer'
              : format(comment.timestamp, 'd MMM', { locale: es })}
          </div>
        )}
      </div>
      <div className="InteractionComment__content">{comment.text}</div>
    </div>
  )
}

export default InteractionComment
