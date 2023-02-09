import { format } from 'date-fns'
import { Comment } from '../../../../../api/types/types'
import InteractionCommentIcon from '../../InteractionComments/InteractionCommentIcon'
import { Emoji } from '../../InteractionComments/InteractionCommentIcon/emojis'
import './SmartphoneComment.css'

const SmartphoneComment = ({ comment }: { comment: Comment }) => {
  return (
    <div className="SmartphoneComment">
      <div className="SmartphoneComment__icon_container">
        <InteractionCommentIcon emoji={comment.emoji as Emoji} />
      </div>
      <p className="SmartphoneComment__text">{comment.text}</p>
      <p className="SmartphoneComment__time">
        Comentario, {format(comment.timestamp, 'HH:mm')}
      </p>
    </div>
  )
}

export default SmartphoneComment
