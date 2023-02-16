import { format } from 'date-fns'
import { Comment } from '../../../../../api/types/types'
import InteractionCommentIcon from '../../InteractionComments/InteractionCommentIcon'
import { Emoji } from '../../InteractionComments/InteractionCommentIcon/emojis'
import './SmartphoneComment.css'

const SmartphoneComment = ({ comment }: { comment: Comment }) => {
  return (
    <div
      className="SmartphoneComment"
      title="Comentario (visible solo en Feedback)"
    >
      <div className="SmartphoneComment__icon_container">
        <InteractionCommentIcon emoji={comment.emoji as Emoji} />
      </div>
      <p className="SmartphoneComment__time">
        {format(comment.timestamp, 'HH:mm')}
      </p>
      <p className="SmartphoneComment__text">{comment.text}</p>
    </div>
  )
}

export default SmartphoneComment
